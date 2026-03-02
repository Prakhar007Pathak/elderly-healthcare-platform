const ServiceCard = ({ service, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer overflow-hidden"
        >
            <img
                src={service.image}
                alt={service.name}
                className="w-full h-40 object-cover"
            />

            <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-800">
                    {service.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                    {service.description}
                </p>

                <p className="mt-3 font-semibold text-blue-600">
                    ₹{service.pricePerHour}/hr
                </p>
            </div>
        </div>
    );
};

export default ServiceCard;