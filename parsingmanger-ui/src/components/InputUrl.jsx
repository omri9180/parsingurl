import {useState} from "react";


const InputUrl   = ({ onAddUrl, isLoading }) => {
    const [url, setUrl] = useState('');
    const [interval, setInterval] = useState('30');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) {
            alert('Please enter a valid URL.');
            return;
        }
        const intervalNum = parseInt(interval, 10);
        if (isNaN(intervalNum) || intervalNum <= 0) {
            alert('Please enter a valid positive number for the interval.');
            return;
        }

        onAddUrl(url, intervalNum).then(() => {
            setUrl('');
            setInterval('30');
        });
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Add New URL to Monitor</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-grow w-full">
                    <label htmlFor="url" className="sr-only">URL</label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 bg-slate-700 text-white border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                        required
                    />
                </div>
                <div className="w-full sm:w-48">
                    <label htmlFor="interval" className="sr-only">Interval (seconds)</label>
                    <div className="relative">
                        <input
                            id="interval"
                            type="number"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            placeholder="Interval (sec)"
                            className="w-full px-4 py-3 bg-slate-700 text-white border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                            required
                            min="1"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">sec</span>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    Add & Monitor
                </button>
            </form>
        </div>
    );
};
export default InputUrl;