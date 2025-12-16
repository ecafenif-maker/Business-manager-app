import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, type, trend }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {type && (
                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${type === 'increase' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {type === 'increase' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span className="ml-1">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
