import React, { useState, useEffect } from "react";
import db from "../firebase";
import "./PlanScreen.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/counter/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlanScreen() {
  const [products, setproducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubcription] = useState(null);

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubcription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start:
              subscription.data().current_period_start.seconds,
          });
        });
      });
  }, [user.uid]);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setproducts(products);
      });
  }, []);

  //console.log(subscription);

  async function loadCheckout(priceId) {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        alert(`An error occured:${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51NgqtzSA5nlsDeK5WTvYMqYCGo4lvLYPc22WgJfC2XVC3JNqKpEXVGfApSUNc2WySro6bICCkBaIww0fNzErdeQF00sGekoHhn"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  }


  return (
    <div className="planScreen">
      <div className="planScreen_Dates">
        {subscription && (
          <p className="planScreen_subscriptionLastDate">
            Start Date:{" "}
            {new Date(
              subscription?.current_period_start * 1000
            ).toLocaleDateString()}
          </p>
        )}

        {subscription && (
          <p className="planScreen_subscriptionLastDate">
            Renewal Date:{" "}
            {new Date(
              subscription?.current_period_end * 1000
            ).toLocaleDateString()}
          </p>
        )}
      </div>

              

      {Object.entries(products).map(([productId, productData]) => {
        //TODO ad some logic to check if the subscription is active or not.

        const isCurrentPackage = productData.name?.includes(subscription?.role);
        console.log(isCurrentPackage);
        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "planScreen_plan--disabled"
            } planScreen_plan`}
          >
            <div className="planScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
          
        );
        
      })}
    </div>
  );
}

export default PlanScreen;
