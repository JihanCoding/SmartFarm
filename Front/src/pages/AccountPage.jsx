import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Account from '../components/Account';

const AccountPage = () => {
  return (
    <div className="nav-fixed">
      <TopNav></TopNav>
        <div id="layoutSidenav">
          <Sidebar></Sidebar>
            <div id="layoutSidenav_content">
              <Account></Account>
              <Footer></Footer>
            </div>
        </div>
    </div>
  )
}

export default AccountPage;