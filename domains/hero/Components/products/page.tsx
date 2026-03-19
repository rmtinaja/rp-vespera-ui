"use client";

import "../scss/hero.scss";
import MarbleBlock from "../dialog/marble-blocks";

export default function LawnLots() {
    return (
        <section className="lawnlots-section">
            <div className="lawnlots-card flex relative overflow-visible">

                {/* LEFT COLUMN */}
                <div className="w-1/2 flex justify-center items-center">
                    <MarbleBlock />
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-1/2 lawnlots-content">
                    <h1 className="lawnlots-title">LAWN LOT</h1>

                    <p className="lawnlots-subtitle">
                        Sophisticated space for
                        <br />
                        sacred memory.
                    </p>

                    <div className="lawnlots-buttons">
                        <a href="#" className="lot-btn">REGULAR LAWN</a>
                        <a href="#" className="lot-btn">PREMIUM LAWN</a>
                        <a href="#" className="lot-btn">SUPER PREMIUM LAWN</a>
                    </div>
                </div>

            </div>
        </section>
    );
}