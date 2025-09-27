import {useState} from "react";


const UrlsList = ({ urlEntry, data, onDelete, onStartMonitor }) => {
    const [isDataVisible, setIsDataVisible] = useState(false);

    return (
        <div className="bg-slate-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out mb-4">
            <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-grow font-mono text-sky-300 break-all mr-4 text-center md:text-left">
                    <a href={urlEntry.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{urlEntry.url}</a>
                    <div className="text-sm text-slate-400 mt-1">Interval: {urlEntry.interval}s</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setIsDataVisible(!isDataVisible)} className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">
                        {isDataVisible ? 'Hide' : 'Show'} Data
                    </button>
                    <button onClick={() => onStartMonitor(urlEntry.url, urlEntry.interval)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors">
                        Start Monitor
                    </button>
                    <button onClick={() => onDelete(urlEntry.url, urlEntry.id)} className="p-2 text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            {isDataVisible && (
                <div className="border-t-2 border-slate-700 p-4">
          <textarea
              readOnly
              value={data || 'Fetching data...'}
              className="w-full h-48 p-3 bg-slate-900 text-slate-300 font-mono text-sm rounded-md border border-slate-600 focus:outline-none resize-none"
              placeholder="No data received yet."
          />
                </div>
            )}
        </div>
    );
};

export default UrlsList;