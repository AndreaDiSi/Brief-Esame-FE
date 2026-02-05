
import BestAccomodation from './accomodation/best-accomodation'
import { LastReservation} from './reservation/last-reservation'
import BestHost from './host/best-host'
import SuperHost from './host/superhost'
import TopTenants from './tenant/top-five-tenant'

const Homepage = () => {
  return (
    <div className="flex-nowrap py-1 px-4 items-center justify-center flex-col gap-20 mt-16">
      <h1 className="text-5xl text-blue-500 font-bold">This is your Dashboard!</h1>
      <div className='grid gap-6 md:grid-cols-3 grid-cols-1 grid-rows-2 '>
        <BestAccomodation/>
        <LastReservation />
        <BestHost/>
        <SuperHost/>
        <TopTenants/>
      </div>
    </div>
  )
}

export default Homepage
