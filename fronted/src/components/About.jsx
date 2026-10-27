
import React from "react";

const About = () => {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
            <div className="grid items-center gap-12 md:grid-cols-2">
                <div>
                    <p className="mb-3 text-sm tracking-[0.25em] text-pink-500">
                        ABOUT FORMALFIT
                    </p>

                    <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                        Confidence Begins With
                        <span className="text-pink-500"> What You Wear.</span>
                    </h1>

                    <p className="mt-6 leading-7 text-gray-600">
                        FormalFit is a formal fashion shopping platform created to make
                        finding professional clothing easier and more convenient.
                    </p>

                    <p className="mt-4 leading-7 text-gray-600">
                        Our goal is to bring formal essentials together in one place,
                        including shirts, trousers, suits, blazers, shoes, and accessories.
                        We want customers to explore available products and find styles
                        that suit their needs and occasions.
                    </p>
                </div>

                <div className="flex min-h-80 items-center justify-center bg-gray-100 p-8">
                    <div className="text-center">
                        <p className="text-4xl font-bold tracking-wider">
                            FORMALFIT<span className="text-pink-500">.</span>
                        </p>

                        <p className="mt-4 text-sm tracking-[0.2em] text-gray-500">
                            FORMAL STYLE. EVERY OCCASION.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
