import cartModel from "../../../db/model/cart.model.js";

export const get = async (req, res) => {
  const cart = await cartModel.findOne({ userId: req.user._id });

  return res.json({ message: "success", procucts:cart.products });
};

export const create = async (req, res) => {
  const { productId } = req.body;
  //res.json(req.user._id)

  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      products: { productId: productId},
    });

    return res.json({ message: "success", cart: newCart });
  }
  //return res.json("ok")

  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId == productId) {
      return res.json({ message: "product already exists" });
    }
    
  }
  cart.products.push({productId});
  await cart.save();
  await res.json({ message: "success", cart });
};

export const remove = async (req, res) => {
  const { productId } = req.params;
  return res.json(productId)

  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: productId, //update in array
        },
      },
    },
    { new: true }
  );
  return res.json({ message: "success" , cart});
};

export const clearCart = async (req, res) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      
        products: [],
    
    },
    { new: true }
  );
  return res.json({ message: "success" ,cart});
};



export const updateQuantity = async (req, res) => {
  // return res.json("ok")
   const { quantity, operator } = req.body;
   const inc = (operator == "+")?quantity:-quantity;
   const cart = await cartModel.findOneAndUpdate(
       { userId: req.user._id,
          "products.productId": req.params.productId },
       {
         $inc: {
           "products.$.quantity": inc,
         },
          
       },
       {
        new: true
       }
       
     );
     if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
 
   return res.json({message:"success",cart});
 };
