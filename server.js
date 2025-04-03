require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");
const mongoose = require("mongoose");
const path = require("path");
const { createCheckoutSession } = require("./controllers/stripe.js"); // Import the Stripe function
const fs = require("fs");
const Stripe = require('stripe'); // Add this line to import Stripe
const nodemailer = require('nodemailer');
const User = require('./models/User'); // Corrected import (only one import needed)


// Initialize Express app
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use your secret key
app.use(cors({ origin: process.env.FRONTEND_URL })); // Enable CORS
app.use(express.json()); // Parse JSON request body


// MongoDB Schema for storing codes
const LoginCodeSchema = new mongoose.Schema({
  email: String,
  code: String,
  createdAt: { type: Date, expires: 300, default: Date.now } // Auto-delete after 5 mins
});
const LoginCode = mongoose.model("LoginCode", LoginCodeSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate and send 6-digit code
app.post("/api/send-code", async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

  await LoginCode.findOneAndUpdate({ email }, { code }, { upsert: true, new: true });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Login Code",
    text: `Your login code is: ${code}. It expires in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ error: "Failed to send email" });
    res.json({ message: "Login code sent!" });
  });
});

// Verify the code
app.post("/api/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const validCode = await LoginCode.findOne({ email, code });

  if (!validCode) return res.status(400).json({ error: "Invalid or expired code" });

  await LoginCode.deleteOne({ email }); // Delete code after use

  // Generate a mock token (use JWT in production)
  const token = "mocked-jwt-token"; 
  res.json({ token });
});



// Send 6-digit code to email
app.post('/api/send-code', async (req, res) => {
  const { email } = req.body;

  // Check if email exists in DB
  let user = await User.findOne({ email });

  // If user doesn't exist, create new user entry
  if (!user) {
    user = new User({ email });
    await user.save(); // Save user email to MongoDB
  }

  // Generate 6-digit code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Store the code and expiration time in the user document
  user.verificationCode = verificationCode;
  user.codeExpiration = Date.now() + 300000; // Code expires in 5 minutes
  await user.save();

  // Send code to user's email using Nodemailer (example)
  await sendEmail(email, verificationCode); // You'll need to implement sendEmail() function

  res.json({ message: 'Verification code sent!' });
});



// Stripe and Frontend Domain Configuration
const YOUR_DOMAIN = process.env.FRONTEND_URL || "http://localhost:3000";

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to AI Resume Database!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Define Mongoose Resume Model
const Resume = mongoose.model(
  "Resume",
  new mongoose.Schema({
    filename: String,
    analysis: String,
    fileSize: Number,
  })
);

// Set up Multer for file uploads (store on disk)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});


app.post('/upload', upload.single('resume'), (req, res) => {
  // Ensure resume is assigned correctly from req.file
  const resume = req.file;  // This should be the uploaded file object

  // Log the file object to see its contents
  console.log(req.file); 

  if (resume && resume.filename) {
    // Construct the resume URL if file upload is successful
    const resumeUrl = `${YOUR_DOMAIN}/uploads/${resume.filename}`;
    res.json({ url: resumeUrl });
  } else {
    // Return an error response if the file upload failed or filename is missing
    res.status(400).send('File upload failed or filename missing');
  }
});


// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Resume Upload Route (Processing & Storage)
app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // Extract text from PDF
    const pdfText = await pdfParse(req.file.path);
    
    // AI Resume Analysis
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume analyzer. Condense the resume text, list skills as bullet points, and replace education/workplaces with icons.",
        },
        { role: "user", content: pdfText.text },
      ],
    });

    const aiSummary = openAIResponse.choices[0]?.message?.content || "No summary available.";

    // Save to Database
    const resumeData = new Resume({
      filename: req.file.filename,
      analysis: aiSummary,
      fileSize: req.file.size,
    });
    await resumeData.save();

    res.json({
      message: "Resume uploaded and analyzed successfully",
      resume: {
        filename: req.file.filename,
        analysis: aiSummary,
        fileSize: req.file.size,
        filePath: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

// Fetch Resumes (Mock Data)
app.get("/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve resumes" });
  }
});

// Stripe Checkout Session Route
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body;  // Receive the priceId from the frontend

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,  // Using the priceId sent from the frontend
          quantity: 1,
        },
      ],
      mode: 'subscription',  // Or 'payment' depending on your use case
      success_url: `${process.env.BASE_URL}/success`,  // Set success redirect
      cancel_url: `${process.env.BASE_URL}/cancel`,    // Set cancel redirect
    });

    res.json({ url: session.url });  // Send back the checkout session URL
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating checkout session");
  }
});


app.delete("/resumes/:id", async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ error: "Resume not found" });

        // Delete file from the uploads folder
        const filePath = `./uploads/${resume.filename}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // Remove from DB
        await Resume.findByIdAndDelete(req.params.id);

        res.json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting resume" });
    }
});



app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
      res.download(filePath);
  } else {
      res.status(404).json({ error: "File not found" });
  }
});

app.get("/share/:id", async (req, res) => {
  try {
    // Attempt to find the resume by ID in the database
    const resume = await Resume.findById(req.params.id);
    
    // If the resume is not found, return a 404 error
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Construct the resume URL using the resume's filename
    const resumeUrl = `${YOUR_DOMAIN}/uploads/${resume.filename}`;
    
    // Create the share page HTML with the resume URL
    const sharePage = `
      <html>
        <head>
          <meta property="og:title" content="My AI-Enhanced Resume" />
          <meta property="og:description" content="Check out my AI-optimized resume!" />
          <meta property="og:image" content="${YOUR_DOMAIN}/uploads/preview.png" />
          <meta property="og:url" content="${resumeUrl}" />
        </head>
        <body>
          <h1>Resume Shared Successfully!</h1>
          <p><a href="${resumeUrl}">Click here to view the resume</a></p>
        </body>
      </html>
    `;

    // Send the HTML content as the response
    res.send(sharePage);
  } catch (error) {
    // If there's any error, return a 500 status with the error message
    res.status(500).json({ error: "Error generating shareable page" });
  }
});


      // Webhook handler
app.post("/api/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`✅ Received event: ${event.type}`);

  res.status(200).json({ received: true });
});
    

const rateLimit = require('express-rate-limit');

// Apply rate limit to /api/send-code route
const sendCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
  message: "Too many requests, please try again later",
});

app.use("/api/send-code", sendCodeLimiter);

app.post("/api/send-code", async (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email });
    await user.save();
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  user.verificationCode = verificationCode;
  user.codeExpiration = Date.now() + 300000;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Login Code",
    text: `Your login code is: ${verificationCode}. It expires in 5 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.json({ message: "Login code sent!" });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});


// Example for verification endpoint
const handleVerifyCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.verificationCode !== code) {
    return res.status(400).json({ error: "Invalid code" });
  }

  if (Date.now() > user.codeExpiration) {
    return res.status(400).json({ error: "Code has expired" });
  }

  // Proceed with login (you can create a JWT, start a session, or similar)
  res.json({ message: "Code verified successfully" });
};




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));