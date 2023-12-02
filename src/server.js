import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

app.post('/create-checkout-session', async (req, res) => {
    try {
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: Math.round(item.price * 100)
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.FRONT_URL}/success`,
            cancel_url: `${process.env.FRONT_URL}/cart`,
        }
        )

        res.json({ url: session.url })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(process.env.PORT || 4444, () => {
    return console.log('Server OK');
})

