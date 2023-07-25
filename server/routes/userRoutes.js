const router=require('express').Router();
const User=require('../models/user');
const Order=require("../models/order");

router.post('/signup', async (req, res)=>{
    const {name, email, password}=req.body;

    try {
        const user=await User.create({name, email, password})
        res.json(user);
    } catch (e) {
        if(e.code===11000){
            return res.status(400).send('Email already exists');
        }
        res.status(400).send(e.message);
    }
})

router.post('/login', async (req, res)=>{
    const {email, password}=req.body;

    try {
        const user=await User.findByCredentials(email, password);
        res.json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.get('/', async (req, res)=>{
    try {
        const users=await User.find({isAdmin: false}).populate('orders')
        res.json(users)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/:id/orders', async(req, res)=>{
    const {id}=req.params;
    try {
        const user=await User.findById(id).populate('orders');
        res.json(user.orders);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/:id/updateNotifications', async(req, res)=>{
    const {id}=req.params;
    try {
        const user=await User.findById(id);
        user.notifications.forEach((notif)=>{
            notif.status='read'
        });
        user.markModified('notifications');
        await user.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports=router;
