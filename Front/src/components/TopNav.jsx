import { useEffect, useRef, useState } from 'react';
import feather from 'feather-icons';
import * as bootstrap from 'bootstrap';  // Bootstrap 객체 사용을 위해 유지
import { useNavigate } from "react-router-dom";
import Alert from './Alert';

function TopNav({setCurrentMain, setCurrentComponent, alram, sideFarm, handleReloadRequest, refreshData}) {
    const sidebarToggleRef = useRef(null); // ref 사용
    const navigate = useNavigate();
    const [isBlinking, setIsBlinking] = useState(false);
    //Nav배너 -> 메인 페이지로 넘어감
    function gotoHome(){
        setCurrentMain("");
    };
    //로그아웃 -> 로그인 페이지로 넘어감
    function gotoLogin(){
        sessionStorage.clear();
        navigate("/login");
    }
    useEffect(()=>{
        setIsBlinking(true);
    
        const allReceived = alram.every(item => item.received_yn === 'y');
    
        if (allReceived) {
            setIsBlinking(false);
        }
    
        console.log("TopNav (alram):", alram, "로드완료");
        console.log("TopNav (sideFarm):", sideFarm, "로드완료");

    },[alram])
    useEffect(() => {
        // Feather Icons 활성화
        feather.replace();

        // Bootstrap Tooltips 활성화
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        // Bootstrap Popovers 활성화
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

        // Bootstrap ScrollSpy 활성화
        const stickyNav = document.querySelector('#stickyNav');
        if (stickyNav) {
            new bootstrap.ScrollSpy(document.body, {
                target: '#stickyNav',
                offset: 82,
            });
        }
        // Sidebar Toggle
        const sidebarToggle = sidebarToggleRef.current;
        const toggleSidebar = () => {
            document.body.classList.toggle('sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sidenav-toggled'));
        };

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }

        // Close side navigation when width < LG
        const sidenavContent = document.querySelector('#layoutSidenav_content');
        const closeSidebarOnClick = () => {
            const BOOTSTRAP_LG_WIDTH = 992;
            if (window.innerWidth < BOOTSTRAP_LG_WIDTH && document.body.classList.contains('sidenav-toggled')) {
                document.body.classList.toggle('sidenav-toggled');
            }
        };

        if (sidenavContent) {
            sidenavContent.addEventListener('click', closeSidebarOnClick);
        }

        // Add active state to sidebar nav links
        let activatedPath = window.location.pathname.match(/([\w-]+\.html)/)?.[0] || 'index.html';

        const targetAnchors = document.querySelectorAll(`[href="${activatedPath}"].nav-link`);

        targetAnchors.forEach(targetAnchor => {
            let parentNode = targetAnchor.parentNode;
            while (parentNode !== null && parentNode !== document.documentElement) {
                if (parentNode.classList.contains('collapse')) {
                    parentNode.classList.add('show');
                    const parentNavLink = document.querySelector(`[data-bs-target="#${parentNode.id}"]`);
                    if (parentNavLink) {
                        parentNavLink.classList.remove('collapsed');
                        parentNavLink.classList.add('active');
                    }
                }
                parentNode = parentNode.parentNode;
            }
            targetAnchor.classList.add('active');
        });

        // Cleanup
        return () => {
            if (sidebarToggle) {
                sidebarToggle.removeEventListener('click', toggleSidebar);
            }
            if (sidenavContent) {
                sidenavContent.removeEventListener('click', closeSidebarOnClick);
            }
        };
    }, [isBlinking]);
    return (
        <nav
            className="topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white"
            id="sidenavAccordion"
        >
            {/* Sidenav Toggle Button*/}
            <button
                className="btn btn-icon btn-transparent-dark order-1 order-lg-0 me-2 ms-lg-2 me-lg-0"
                id="sidebarToggle"
                ref={sidebarToggleRef}
            >
                <i data-feather="menu" />
            </button>
            <div onClick={gotoHome} className="navbar-brand pe-3 ps-4 ps-lg-2">
                바닷말
            </div>
            <ul className="navbar-nav align-items-center ms-auto">
                <li className="nav-item dropdown no-caret d-none d-sm-block me-3 dropdown-notifications">
                    <a
                        className={`btn btn-icon btn-transparent-dark dropdown-toggle notification-icon ${isBlinking ? 'blink' : ''}`}
                        id="navbarDropdownAlerts"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i 
                        data-feather="bell"    
                        />
                    </a>
                    <div
                        className="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up"
                        aria-labelledby="navbarDropdownAlerts"
                    >
                        <h6 className="dropdown-header dropdown-notifications-header">
                            <i className="me-2" data-feather="bell" />
                            알람
                        </h6>
                        {/* Example Alert 1*/}
                        <Alert alram={alram} setCurrentComponent = {setCurrentComponent} sideFarm = {sideFarm} handleReloadRequest={handleReloadRequest} setCurrentMain= {setCurrentMain} refreshData= {refreshData}/>
                    </div>
                </li>
                {/* User Dropdown*/}
                <li className="nav-item dropdown no-caret dropdown-user me-3 me-lg-4">
                    <a
                        className="btn btn-icon btn-transparent-dark dropdown-toggle"
                        id="navbarDropdownUserImage"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <img
                            className="img-fluid"
                            src="../profile.jpg"
                        />
                    </a>
                    <div
                        className="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up"
                        aria-labelledby="navbarDropdownUserImage"
                    >
                        <h6 className="dropdown-header d-flex align-items-center">
                            <img
                                className="dropdown-user-img"
                                src="../profile.jpg"
                            />
                            <div className="dropdown-user-details">
                                <div className="dropdown-user-details-name">{sessionStorage.getItem("name")}</div>
                                <div className="dropdown-user-details-email">{sessionStorage.getItem("email")}</div>
                            </div>
                        </h6>
                        <div className="dropdown-divider" />
                        <div className="dropdown-item" onClick={gotoLogin}>
                            <div className="dropdown-item-icon">
                                <i data-feather="log-out" />
                            </div>
                            로그아웃
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
  )
}

export default TopNav;