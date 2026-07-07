export default function OrderSkeleton() {

    return (

        <div className="space-y-8">

            {[1, 2, 3].map((item) => (

                <div
                    key={item}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-pulse"
                >

                    <div className="p-8">

                        {/* Header */}

                        <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

                            <div className="space-y-4">

                                <div className="h-5 w-52 bg-slate-200 rounded"></div>

                                <div className="h-4 w-72 bg-slate-100 rounded"></div>

                                <div className="flex gap-3 mt-3">

                                    <div className="h-8 w-24 rounded-full bg-slate-200"></div>

                                    <div className="h-8 w-24 rounded-full bg-slate-200"></div>

                                </div>

                            </div>

                            <div className="text-right space-y-4">

                                <div className="h-4 w-24 bg-slate-100 rounded ml-auto"></div>

                                <div className="h-9 w-32 bg-slate-200 rounded ml-auto"></div>

                                <div className="h-8 w-28 rounded-full bg-slate-200 ml-auto"></div>

                            </div>

                        </div>

                        {/* Store */}

                        <div className="mt-10 flex items-center gap-5 bg-slate-50 rounded-2xl p-5">

                            <div className="w-16 h-16 rounded-xl bg-slate-200"></div>

                            <div className="flex-1">

                                <div className="h-5 w-44 bg-slate-200 rounded"></div>

                                <div className="h-4 w-24 bg-slate-100 rounded mt-3"></div>

                            </div>

                            <div className="h-10 w-40 rounded-xl bg-slate-200"></div>

                        </div>

                        {/* Timeline */}

                        <div className="grid grid-cols-4 gap-4 mt-10">

                            {[1,2,3,4].map(step => (

                                <div
                                    key={step}
                                    className="text-center"
                                >

                                    <div className="w-10 h-10 rounded-full bg-slate-200 mx-auto"></div>

                                    <div className="h-3 w-16 bg-slate-100 rounded mx-auto mt-3"></div>

                                </div>

                            ))}

                        </div>

                        {/* Products */}

                        <div className="mt-12 space-y-5">

                            {[1,2].map(product => (

                                <div
                                    key={product}
                                    className="flex gap-5 bg-slate-50 rounded-2xl p-5"
                                >

                                    <div className="w-28 h-28 rounded-xl bg-slate-200"></div>

                                    <div className="flex-1 space-y-4">

                                        <div className="h-5 w-64 bg-slate-200 rounded"></div>

                                        <div className="h-4 w-40 bg-slate-100 rounded"></div>

                                        <div className="flex gap-10">

                                            <div className="h-4 w-20 bg-slate-100 rounded"></div>

                                            <div className="h-4 w-20 bg-slate-100 rounded"></div>

                                            <div className="h-4 w-24 bg-slate-200 rounded"></div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* Summary */}

                        <div className="mt-10 bg-slate-50 rounded-3xl p-8">

                            <div className="space-y-5">

                                {[1,2,3,4].map(line => (

                                    <div
                                        key={line}
                                        className="flex justify-between"
                                    >

                                        <div className="h-4 w-32 bg-slate-100 rounded"></div>

                                        <div className="h-4 w-24 bg-slate-200 rounded"></div>

                                    </div>

                                ))}

                                <div className="h-px bg-slate-200"></div>

                                <div className="flex justify-between">

                                    <div className="h-7 w-40 bg-slate-200 rounded"></div>

                                    <div className="h-7 w-32 bg-slate-300 rounded"></div>

                                </div>

                            </div>

                        </div>

                        {/* Footer Buttons */}

                        <div className="flex flex-wrap gap-4 mt-10">

                            {[1,2,3,4].map(button => (

                                <div
                                    key={button}
                                    className="h-11 w-40 rounded-xl bg-slate-200"
                                ></div>

                            ))}

                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

}