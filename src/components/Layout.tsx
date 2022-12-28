import React, { useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
import { FrontEndContext } from '../context/FrontEndContext';
import { FlexDiv } from '../styles/globalStyleComponent';
import '../styles/globalStyles.scss';
import '../styles/frontend.scss';
import { MdMenu, MdClose } from 'react-icons/md';

import { PageWithChild } from './PageWithChild';
import { SinglePage } from './SinglePage';
import { HomePage } from './HomePage';
import { ContactPage } from './ContactPage';

// export type PageWithImageDataType = {
//     normalDetail:Page | null
//     imageDetail:Page[] | null
// }

export const Layout = ()=>{
    const {frontEndState} = React.useContext(FrontEndContext);

    // to store the location path
    // const [currentPath, setCurrentPath] = React.useState('/');

    // to store the current page and its children
    // const [currentPage, setCurrentPage] = React.useState({} as PageWithImageDataType);
    // const [childPage, setChildPage] = React.useState({} as PageWithImageDataType[]);

    // get location pathname
    // const location = useLocation();   
    // const pagePath = location.pathname === '/'?'home-1': location.pathname.split('/page/')[1];
    // console.log(pagePath);
    // set the currentPath only if the path is different
    // if(pagePath !== currentPath){
    //     setCurrentPath(pagePath);
    // }

    // get reference of header
    const headerRef = useRef<HTMLElement>(null);
    const topMenuBtnRef = useRef<HTMLElement>(null);
    const topMenu = useRef<HTMLElement>(null);


    /**
     * to toogle the top menu when menu icon is clicked.
     */
    const toogleTopMenu = (e:React.MouseEvent)=>{
        // show and hide menu div
        topMenu.current!.style!.display = topMenu.current!.style!.display === "block"?"none":"block";
        
        // toogle menu btn 
        topMenu.current!.style!.display === "block"?  topMenuBtnRef!.current!.classList.add('top-menu__btn--close'):  topMenuBtnRef!.current!.classList.remove('top-menu__btn--close');
        
        // adjust the height of header while menu open or close
        headerRef.current!.style!.height = (topMenu.current!.style!.display === "block") ? "auto": (topMenu.current!.style!.display === "none") && (headerRef.current?.classList.contains('fixed')) ? "50px":"auto";
    }

    useEffect(()=>{
        // add scroll event listener on window object
        window.addEventListener('scroll',()=>{
            if(window.scrollY > 75){
                headerRef.current?.classList.add('fixed');

                // adjust the height of header while menu open or close
                headerRef.current!.style!.height = (topMenu.current!.style!.display === "none") ? "50px": "auto";
            }
            else{
                headerRef.current?.classList.remove('fixed');

                // adjust the height of header while menu open or close
                headerRef.current!.style!.height = "auto";
            }

        })
    },[]);

    return(
        <FlexDiv flex="1 1 100%" height="100%" minWidth="320px" flexDirection="column" alignContent="start">
            {/* Header */}
            <FlexDiv 
                flex="0 1 80px" 
                width="100%" 
                justifyContent="space-between" 
                alignItems="center"
                flexGap="15px"
                padding="15px"
                className="header"  
                ref={headerRef}  
            >
                <FlexDiv flex="0 0 80px" height="80px" className="header__logo-wrapper">
                    <img className="header__logo" src={frontEndState.logo?.imageUrl} alt={frontEndState.logo?.imageName}/>
                    <span ref={topMenuBtnRef} className="top-menu__btn" onClick={toogleTopMenu}>
                        <MdMenu className="top-menu__btn--open-icon"/>
                        <MdClose className="top-menu__btn--close-icon"/>
                    </span>
                </FlexDiv>


                <FlexDiv flex="1 1 auto" gap="10px" ref={topMenu} justifyContent="flex-end" className="top-menu">
                    {frontEndState.headerMenu?.map((menu)=>(
                        <Link key={menu.id} to={`/page/${menu.pageAlias}`} className="top-menu__link">
                            <FlexDiv flex="0 0 auto" alignItem="center" className="top-menu__link--name">{menu.title}</FlexDiv>
                        </Link>
                    ))}
                </FlexDiv>
            </FlexDiv>

            {/* Body */}
            <FlexDiv flex="1 1 auto" width="100%">
                {/*
                    we won't be using the Outlet here.
                    we will rather render page conditionally.
                <Outlet/> */}
                {frontEndState?.currentPage?.normalDetail?.pageAlias==='home-1'?<HomePage/>:
                    frontEndState?.currentPage?.normalDetail?.pageAlias==='contact-us'?<ContactPage/>:
                    frontEndState?.childPage!?.length>0?<PageWithChild/>:
                    <SinglePage/>}
            </FlexDiv>

            {/* Footer */}
            <FlexDiv flex="1 0 1" flexDirection="column" alignContent="start" width="100%" className="footer">
                {frontEndState.childPage!?.length > 0 && frontEndState?.currentPage?.normalDetail?.pageAlias !== 'contact-us'?<FlexDiv flex="1 1 auto" width="100%" className="footer__social-wrapper">
                    <FlexDiv flex="1 1 auto" flexDirection="column" className="container">
                        <FlexDiv flex="1 1 auto" width="100%" className="page-title page-title__sub" justifyContent="flex-start">Site Links</FlexDiv>
                        <FlexDiv flex="1 1 auto" width="100%" justifyContent="flex-start" gap="50px" flexWrap="wrap" className="social-links__wrapper">
                            {
                                frontEndState.childPage?.map((child)=>{
                                    return(
                                        <FlexDiv flex="0 1 1" key={child.normalDetail?.id}>
                                            <ul className="social-links ul__default-link">
                                                <li key={child.normalDetail?.id} className="li-title"><a href={child.normalDetail?.pageAlias}>{child.normalDetail?.title}</a></li>
                                                {
                                                    // child?.subChilds?.map(((subChild)=>{
                                                    //     return(<li key={subChild.id}><a href={subChild.pageAlias}>{subChild.title}</a></li>)
                                                    // }))
                                                    child.subChilds?.map((subChild)=>{
                                                        if(subChild.pageAlias === 'location'){
                                                            return(<li key={subChild.id}><a href={child.normalDetail?.pageAlias}>{subChild.title}</a></li>)
                                                        }else{
                                                            return(<li key={subChild.id}><a href={subChild.pageAlias}>{subChild.title}</a></li>)
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </FlexDiv>
                                    )
                                })
                            }
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>:''}
                <FlexDiv flex="1 1 1" width="100%" className="footer__copy-policy">
                    <FlexDiv flex="1 1 auto" justifyContent="space-between" alignItems="center" gap="20px" flexWrap="wrap" className="container">
                        <FlexDiv flex="1 1 1" flexDirection="column">
                            {frontEndState?.copyRight?<FlexDiv><pre dangerouslySetInnerHTML={{ __html:`${frontEndState?.copyRight?.description!}`}}></pre></FlexDiv>:''}
                        </FlexDiv>
                        <FlexDiv flex="1 1 1" justifyContent="center" className="footer-social-link" gap="20px">
                            {frontEndState.footerSocialLinks?.map((link)=>(
                                <a key={link.id} href={link.description.toString().replace( /(<([^>]+)>)/ig, '')} target="_blank" rel="noreferrer"> <img src={link.imageUrl} alt={link.imageName}/></a>
                            ))}
                        </FlexDiv>
                        {/* <FlexDiv flex="1 1 auto" justifyContent="center">this is contact us</FlexDiv> */}
                        {frontEndState?.footerContact?<FlexDiv flex="1 1 1"><pre  dangerouslySetInnerHTML={{ __html:`${frontEndState?.footerContact?.description!}`}}></pre></FlexDiv>:''}
                    </FlexDiv>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    )
}