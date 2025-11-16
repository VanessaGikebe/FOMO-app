
// Component for the Moderator Metric/Stat Cards
const MetricCard = ({ title, value, iconPath, iconColor, valueColor }) => (
  <div className="w-full sm:w-1/3 p-2">
    {/* Using light gray background and shadow for elevation as per design */}
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-3 border-2 border-purple-100 hover:border-[#6C5CE7] transition-all">
      
      <div className="flex items-center space-x-3">
        {/* Icon Area - Custom background for emphasis */}
        <div className={`flex-shrink-0 rounded-full p-2`} style={{backgroundColor: iconColor}}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
          </svg>
        </div>
        {/* Title */}
        <p className="text-sm font-medium text-gray-700">{title}</p>
      </div>

      {/* Value */}
      <div>
        <p className={`text-4xl font-bold`} style={{color: valueColor}}>{value}</p>
      </div>
      
    </div>
  </div>
);

// Component for an individual Event Card with Moderator actions
const EventCard = ({ 
  category = "Technology", 
  title = "Event Title", 
  date = "2025-11-01", // Restored correct prop name and default
  time = "09:00 AM", // Restored correct prop name and default
  description = "Join us for the biggest tech conference of the year featuring industry leaders, cutting-edge innovation..." // Restored description prop and default
}) => (
  <div className="w-full sm:w-1/3 p-2 flex-shrink-0">
    {/* Added h-full flex flex-col to ensure uniform card height and button alignment */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-[#6C5CE7] transition-all hover:shadow-xl h-full flex flex-col">
      
      {/* Top Visual Area (White Background, Confetti Icon, Category Tag) */}
      <div className="relative pt-[60%] bg-gradient-to-br from-teal-50 to-purple-50 border-b border-gray-100"> 
        
        {/* Category Tag: Dark Background, Top Right */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00D9C0] to-[#00C4AC] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg"> 
          {category}
        </div>

        {/* Centered Confetti Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-5xl">🎉</span> 
        </div>
      </div>
      
      {/* Text Content Section */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
            {/* Title */}
            {/* Increased title size slightly from the snippet for better hierarchy */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            
            {/* Description (Restored) */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

            {/* Date/Time (Restored with icon) */}
            <div className="flex items-center text-sm font-medium text-gray-700 mb-4">
                <svg className="w-4 h-4 text-[#00D9C0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {date} | {time}
            </div>
        </div>
        
        {/* Moderator Action Buttons (Kept from Moderator design) */}
        <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-auto">
            {/* View Event Button (Dark) */}
            <button className="flex-1 bg-gradient-to-r from-[#6C5CE7] to-[#5B4BCF] text-white text-sm py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
              View Event
            </button>
            {/* Flag Event Button (Red) */}
            <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
              Flag Event
            </button>
        </div>
      </div>
    </div>
  </div>
);

// Component for Quick Action Buttons
const QuickActionButton = ({ title, iconPath }) => (
  <button className="w-full sm:w-1/5 p-2 flex-shrink-0">
    <div className="bg-white hover:bg-gradient-to-br hover:from-teal-50 hover:to-orange-50 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition-all duration-200 h-32 border-2 border-purple-100 hover:border-[#00D9C0] hover:scale-105">
      {/* Icon */}
      <div className="bg-gradient-to-br from-[#00D9C0] to-[#00C4AC] rounded-full p-2 mb-2">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
        </svg>
      </div>
      {/* Title */}
      <span className="text-sm font-medium text-gray-900">{title}</span>
    </div>
  </button>
);


// --- Main Dashboard Component ---

export default function ModeratorDashboard() {
  // Dummy data for event moderation list
  const eventsToReview = [
    { category: "Technology", title: "Tech Summit 2025" },
    { category: "Music", title: "Live Music Gala" },
    { category: "Food & Drink", title: "Gourmet Food Fair" },
    // { category: "Art", title: "Modern Art Display" }, // Added two more for a fuller view
    // { category: "Sports", title: "Local Football Tournament" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
      
      {/* --- Main Dashboard Content --- */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. Moderator Insights Section (Metrics) */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-1">Moderator Insights</h2>
            <p className="text-gray-600 mb-6">Track approvals, declines, and overall moderation activity</p>
            
            <div className="flex flex-wrap -m-2">
              {/* Viewers/Events to Review */}
              <MetricCard 
                title="Viewers" 
                value="24" 
                iconPath="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" // Eye Icon
                iconColor="#4B5563" // Gray
                valueColor="#1F2937" // Dark Gray
              />
              {/* Denied */}
              <MetricCard 
                title="Denied" 
                value="17" 
                iconPath="M6 18L18 6M6 6l12 12" // X Icon
                iconColor="#DC2626" // Red
                valueColor="#DC2626" // Red
              />
              {/* Validated */}
              <MetricCard 
                title="Validated" 
                value="132" 
                iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" // Checkmark Icon
                iconColor="#10B981" // Green
                valueColor="#10B981" // Green
              />
            </div>
          </section>
          
          {/* 2. Events to Moderate Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-1">Events to Moderate</h2>
            <p className="text-gray-600 mb-6">Review new event submissions for compliance and content quality</p>
            
            <div className="flex flex-wrap -m-2">
              {eventsToReview.map((event, index) => (
                <EventCard 
                  key={index} 
                  category={event.category}
                  title={event.title}
                  // Passed sample data to demonstrate the detailed card style
                  description={`Review the submission details for the ${event.title} to ensure it meets all community standards and legal requirements.`}
                  date="2025-11-20" 
                  time="10:00 AM" 
                />
              ))}
            </div>
          </section>
          
          {/* 3. Quick Actions Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-1">Quick Actions</h2>
            <p className="text-gray-600 mb-6">Streamline your moderation workflow with easy one-step actions</p>
            
            <div className="flex flex-wrap -m-2">
              {/* View Event (Singular) */}
              <QuickActionButton 
                title="View Event" 
                iconPath="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" // Eye Icon
              />
              {/* Flag Event */}
              <QuickActionButton 
                title="Flag Event" 
                iconPath="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" // Flag Icon Placeholder
              />
            </div>
          </section>
          
        </div>
      </main>

      {/* --- Footer Component --- */}    </div>
  );
}