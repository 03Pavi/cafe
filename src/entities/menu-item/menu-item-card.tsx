"use client";

import type { MenuItem } from "@/entities/menu-item/menu-data";
import { useAppDispatch } from "@/store/hooks";
import { addToOrder } from "@/entities/order/model/order-slice";

type MenuCardProps = {
  item: MenuItem;
};

export function MenuCard({ item }: MenuCardProps) {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(
      addToOrder({
        name: item.name,
        price: item.price,
        description: item.description,
      })
    );
  };

  return (
    <article className="menu-card">
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", width: "100%" }}>
        <strong style={{ fontSize: "1.25rem" }}>{item.price}</strong>
        <button onClick={handleAdd} className="button button--secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
          Add +
        </button>
      </div>
    </article>
  );
}
