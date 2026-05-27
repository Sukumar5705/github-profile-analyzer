    const express = require("express");
    const cors = require("cors");
    require("dotenv").config();

    const githubRoutes = require("./routes/githubRoutes");

    const app = express();


    app.use(cors());
    app.use(express.json());



    app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "GitHub Profile Analyzer API Running"
    });
    });


    app.use("/api/github", githubRoutes);



    app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
    });



    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });