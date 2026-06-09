"use client";

import type { MenuItem } from "@/entities/menu-item/menu-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToOrder, updateQuantity, removeFromOrder } from "@/entities/order/model/order-slice";

type MenuCardProps = {
  item: MenuItem;
};

export function MenuCard({ item }: MenuCardProps) {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((state) =>
    state.order.items.find(i => i.name === item.name)
  );

  const handleAdd = () => {
    dispatch(
      addToOrder({
        name: item.name,
        price: item.price,
        description: item.description,
      })
    );
  };

  const handleQuantityChange = (delta: number) => {
    if (!cartItem) return;
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      dispatch(removeFromOrder(item.name));
    } else {
      dispatch(updateQuantity({ name: item.name, quantity: newQty }));
    }
  };

  return (
    <article className="menu-card">
      {item.image && (
        <div className="menu-card__image-wrapper">
          <img src={item.image} alt={item.name} className="menu-card__image" />
        </div>
      )}
      <div className="menu-card__content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
      <div className="menu-card__footer">
        <strong className="menu-card__price">{item.price}</strong>

        {cartItem ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid var(--color-caramel)",
            borderRadius: "20px",
            overflow: "hidden",
            background: "var(--color-cream)"
          }}>
            <button
              onClick={() => handleQuantityChange(-1)}
              style={{ background: "none", border: "none", padding: "4px 10px", cursor: "pointer", fontWeight: "900", color: "var(--color-espresso)" }}
            >
              -
            </button>
            <span style={{ fontWeight: "900", fontSize: "0.9rem", minWidth: "12px", textAlign: "center" }}>{cartItem.quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              style={{ background: "none", border: "none", padding: "4px 10px", cursor: "pointer", fontWeight: "900", color: "var(--color-espresso)" }}
            >
              +
            </button>
          </div>
        ) : (
          <button onClick={handleAdd} className="button button--secondary" style={{ padding: "6px 16px", fontSize: "0.85rem", borderRadius: "20px" }}>
            Add +
          </button>
        )}
      </div>
    </article>
  );
}
