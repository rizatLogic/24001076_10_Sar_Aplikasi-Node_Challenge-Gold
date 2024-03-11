const express = require("express")
const { User, Order, Item } = require("./models")
const app = express()
app.use(express.json())

app.post("/register", async(req, res) => {
    const user = new User;
    user.name = req.body.name;
    user.address = req.body.address;
    user.email = req.body.email;
    user.password = req.body.password;

    await user.save();

    return res.sendStatus(200)
})
app.post("/login", async (req, res) => {
    const userExist = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!userExist) {
        return res.sendStatus(401)
    }

    const isValidPassword = userExist.password == req.body.password
    if (!isValidPassword) {
        return res.status(401)
    }

    return res.status(200).json({
        message: "Login Success",
        data : {
            token: Buffer.from(req.body.email).toString("base64")
        }
    })
    
})
app.get("/items", async (req,res) => {
    return res.json(await Item.findAll())
})
app.post("/items", async (req,res) => {
    const item = new Item;
    item.name = req.body.name;
    item.price = req.body.price;
    await item.save();

    return res.sendStatus(200)
    
})
app.post("/orders",async (req, res) => {
    const order = new Order;
    order.total_price = req.body.total_price;
    order.quantity = req.body.quantity;
    order.status = req.body.status;
    await order.save();
    return res.status(200).json({
        message: "Order Has Successfully Created",
        data: order
    })
})
app.get("/orders", async (req, res) => {
    return res.json(await Order.findAll())
})
app.patch("/orders/:order_id", async (req, res) => {
    const orderToUpdate = await Order.findByPk(req.params.order_id);
    //Ketika tidak ditemukan data ordernya
    if (!orderToUpdate) {
        return res.status(400).json({
            message : "Cannot Find Your Order",
            code: "ERR_ORDER_ID_NOT_EXIST"
        })
    }

    //Ketika ditemukan data ordernya
    orderToUpdate.status = "finished";
    await orderToUpdate.save();
    return res.status(200).json({
        message: "Your Order Has Successfully Updated",
        data: orderToUpdate
    })
})
app.delete("/orders/:order_id",async(req, res) => {
    const deleteOrder = await Order.findByPk(req.params.order_id);
    if (!deleteOrder) {
        return res.status(400).json({
            message : "Cannot Find Your Order",
            code: "ERR_ORDER_ID_NOT_EXIST"
        })
    } else {
        Order.destroy({
            where : {
                id : req.params.order_id  
            }
        })
    }

    await deleteOrder.save();
    return res.status(200).json({
        message: "Your Order Has Successfully Deleted",
    })
 
})





app.listen(3000, () => console.log("Server is listening on port 3000"))
