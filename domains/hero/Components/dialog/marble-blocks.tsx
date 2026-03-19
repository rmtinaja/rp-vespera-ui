import Image from "next/image";
import "../scss/hero.scss";
export default function MarbleBlock() {
    return (
        <div className="assembly-scene">
            <div className="assembled-wrapper">
                <div className="piece piece-lower">
                    <Image
                        src="/assets/images/lastlevel.png"
                        alt="Lower base"
                        width={1200}
                        height={800}
                        className="piece-img"
                        priority
                    />
                </div>

                <div className="piece piece-middle">
                    <Image
                        src="/assets/images/2ndlevel.png"
                        alt="Middle base"
                        width={1200}
                        height={800}
                        className="piece-img"
                        priority
                    />
                </div>

                <div className="piece piece-grass">
                    <Image
                        src="/assets/images/grass.png"
                        alt="Grass cover"
                        width={1300}
                        height={700}
                        className="piece-img"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}