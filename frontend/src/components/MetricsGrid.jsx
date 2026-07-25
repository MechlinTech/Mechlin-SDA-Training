import { useMemo } from "react";
import MetricsCard from "./MetricsCard";

function MetricsGrid({ metrics }) {

  const cards = useMemo(() => {

    return [

      {
        title: "Total Users",
        value: metrics.users,
        icon: "👥",
        type: "card-primary",
        change: 12,
      },

      {
        title: "Revenue",
        value: `₹${metrics.revenue}`,
        icon: "💰",
        type: "card-success",
        change: 8,
      },

      {
        title: "Orders",
        value: metrics.orders,
        icon: "📦",
        type: "card-warning",
        change: -3,
      },

      {
        title: "Growth Rate",
        value: `${metrics.growthRate}%`,
        icon: "📈",
        type: "card-info",
        change: metrics.growthRate,
      },

    ];

  }, [metrics]);

  return (

    <div className="dashboard-grid">

      {cards.map((card) => (

        <MetricsCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          type={card.type}
          change={Number(card.change)}
        />

      ))}

    </div>

  );

}

export default MetricsGrid;