import React from 'react'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom';
const Account = () => {
const navigate = useNavigate();
const gotoAccount = ()=>{
    navigate('/account')
}
const gotoProfile = ()=>{
    navigate('/profile')
}
  return (
    <>
               <Sidebar/>
                    <main>
                        <header className="page-header page-header-compact page-header-light border-bottom bg-white mb-4">
                        <div className="container-xl px-4">
                            <div className="page-header-content">
                            <div className="row align-items-center justify-content-between pt-3">
                                <div className="col-auto mb-3">
                                <h1 className="page-header-title">
                                    <div className="page-header-icon">
                                    <i data-feather="user" />
                                    </div>
                                    프로필 수정 / 계정 관리
                                </h1>
                                </div>
                            </div>
                            </div>
                        </div>
                        </header>
                        {/* Main page content*/}
                        <div className="container-xl px-4 mt-4">
                        {/* Account page navigation*/}
                        <nav className="nav nav-borders">
                            <a className="nav-link " onClick={gotoProfile}>
                            프로필
                            </a>
                            <a className="nav-link active" onClick={gotoAccount}>
                            계정관리
                            </a>
                        </nav>
                        <hr className="mt-0 mb-4" />
                        <div className="row">
                           <div className="col-xl-12">
                            {/* Account details card*/}
                            <div className="card mb-4">
                                <div className="card-header">계정 관리</div>
                                <div className="card-body">
                                <form>
                                    {/* Form Group (username)*/}
                                    <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputUsername">
                                        이메일
                                    </label>
                                    <input
                                        className="form-control"
                                        id="inputUsername"
                                        type="text"
                                        placeholder="이메일을 변경해주세요."
                                    />
                                    </div>
                                    {/* Form Row*/}
                                    <div className="row gx-3 mb-3">
                                    {/* Form Group (first name)*/}
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputFirstName">
                                        성
                                        </label>
                                        <input
                                        className="form-control"
                                        id="inputFirstName"
                                        type="text"
                                        placeholder="성"
                                        />
                                    </div>
                                    {/* Form Group (last name)*/}
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputLastName">
                                        이름
                                        </label>
                                        <input
                                        className="form-control"
                                        id="inputLastName"
                                        type="text"
                                        placeholder="이름"
                                        />
                                    </div>
                                    </div>
                                    {/* Form Row        */}
                                    
                                    {/* Form Group (email address)*/}
                                    <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputEmailAddress">
                                        이메일
                                    </label>
                                    <input
                                        className="form-control"
                                        id="inputEmailAddress"
                                        type="email"
                                        placeholder="name@example.com"
                                    />
                                    </div>
                                    {/* Form Row*/}
                                    <div className="row gx-3 mb-3">
                                   
                                    {/* Form Group (birthday)*/}
                                    <div className="col-md-12">
                                        <label className="small mb-1" htmlFor="inputBirthday">
                                        비밀번호
                                        </label>
                                        <input
                                        className="form-control"
                                        id="inputBirthday"
                                        type="text"
                                        name="birthday"
                                        placeholder="비밀번호"
                                        />
                                    </div>
                                    </div>
                                    {/* Save changes button*/}
                                    <button className="btn btn-primary" type="button">
                                    저장하기
                                    </button>
                                </form>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </main>
</>
  )
}

export default Account