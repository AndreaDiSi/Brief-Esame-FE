import BestAccomodation from './accomodation/best-accomodation'
import { LastReservation} from './reservation/last-reservation'
import BestHost from './host/best-host'
import SuperHost from './host/superhost'
import TopTenants from './tenant/top-five-tenant'

const Homepage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time insights and analytics at a glance
          </p>
        </div>

        {/* Grid Layout */}
        <div className="space-y-6">
          {/* Top Row - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="transform transition-all duration-300 ">
              <BestAccomodation />
            </div>
            <div className="transform transition-all duration-300 ">
              <LastReservation />
            </div>
            <div className="transform transition-all duration-300 ">
              <BestHost />
            </div>
          </div>

          {/* Bottom Row - 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="transform transition-all duration-300 ">
              <SuperHost />
            </div>
            <div className="transform transition-all duration-300 ">
              <TopTenants />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage