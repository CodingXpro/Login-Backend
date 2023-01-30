import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

mongoose.connect('MONGO_URL', () => {
    console.log("DB Connected");
});
//Model Creation

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema);

//Routes

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successfully", user: user });
            } else {
                res.send({ message: "Password didn't Match" })
            }

        } else {
            res.send({ message: "User not Registered" });
        }
    })
})
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send("User already registered");
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ message: "Successfully Registered, Please Login now." })
                }
            });
        }
    })


})

app.listen(PORT, () => {
    console.log(`Server is running on 8000 ${PORT}`);
})
