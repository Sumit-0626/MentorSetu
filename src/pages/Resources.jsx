import { useEffect, useState } from "react";

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Gather all mentor resources from localStorage
    const allResources = JSON.parse(localStorage.getItem('mentorResources') || '{}');
    let flat = [];
    Object.values(allResources).forEach(arr => {
      flat = flat.concat(arr);
    });
    // Sort by most recent
    flat.sort((a, b) => new Date(b.date) - new Date(a.date));
    setResources(flat);
  }, []);

  function getSafeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url.replace(/^\/*/, '');
    }
    return url;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">📚 Mentor Resources</h1>
        {resources.length === 0 ? (
          <p className="text-gray-500 text-center">No resources uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {resources.map((res, idx) => (
              <li key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1 font-semibold">By {res.mentorName}</div>
                <a href={getSafeUrl(res.url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline text-lg">{res.title}</a>
                {res.description && <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">{res.description}</div>}
                <div className="text-xs text-gray-400 mt-1">{new Date(res.date).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Resources; 