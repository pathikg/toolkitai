import DodoPayments from "dodopayments";
import { NextRequest, NextResponse } from "next/server";
const dodopayments = new DodoPayments({
    environment: "test_mode",
    bearerToken: process.env.DODOPAYMENTS_API_KEY!,
  });


  export async function POST(req: NextRequest) {
    try {
      // Generate checkout URL
      const body = await req.json();
  
      const regex = new RegExp("^[^@]+@[^@]+.[^@]+$");
  
      if (!body.name)
        return NextResponse.json(
          {
            message: "Please provide a valid name",
          },
          { status: 400 }
        );
  
      if (!body.email && !regex.test(body.email))
        return NextResponse.json(
          {
            message: "Please provide a valid email",
          },
          { status: 400 }
        );
  
      const customerName = body.name;
      const customerEmail = body.email;
  
      const checkout = await dodopayments.checkoutSessions.create({
        product_cart: [
          {
            product_id: "pdt_zL2ZTxrs7MFg42hZemySH",
            quantity: 1,
          },
        ],
        customer: {
          name: customerName,
          email: customerEmail,
        },
        return_url: "http://localhost:3000/",
      });
  
      return NextResponse.json({
        message: "Checkout URL created successfully",
        url: checkout.checkout_url,
      });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        {
          message: "Internal server error",
        },
        {
          status: 500,
        }
      );
    }
  }