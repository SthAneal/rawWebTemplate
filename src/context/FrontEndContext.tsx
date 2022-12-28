import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


import { ref, get, onValue, query, orderByChild, equalTo} from 'firebase/database';
import { db } from "../firebase";

import { Page } from './DashboardContext';

type HeaderMenuType = {
    id:number
    title:string
    pageAlias:string
    pageType:string
    pageOrder:number
    pageLinkList?:number[]
    pageImageList?:number[]
    pageChildList?:{childId:number,childOrder:number}[]
}

type PageLogoType = {
    id:number
    title:string
    pageAlias:string
    imageName:string
    imageUrl:string
}

export type PageWithImageDataType = {
    normalDetail:Page | null
    imageDetail:Page[] | null
    subChilds?:Page[] | null
    pageOrder?:number
}

type FrontEndStateType = {
    headerMenu:HeaderMenuType[] | null
    logo:PageLogoType | null
    pagePath:string
    currentPage: PageWithImageDataType | null
    childPage: PageWithImageDataType[] | null
    copyRight:Page | null
    footerContact:Page | null
    footerSocialLinks:Page[] | null
}

type FrontEndContextType = {
    frontEndState:FrontEndStateType
    getHeaderMenu:()=>void
    getPageByAttributeAndValue:(pageAttribute:string, value:string | number)=>Promise<Page[]>
    getPageDetails:()=>void
}

type FrontEndProviderType = {
    children: React.ReactNode
}

type FrontEndAction = {
    type:'SET_HEADER' | 'SET_LOGO' | 'SET_PAGE_PATH' | 'SET_CURRENT_PAGE' | 'SET_CHILD_PAGE' | 'SET_SUB_CHILD' | 'SET_COPY_RIGHT' | 'SET_FOOTER_CONTACT' | 'SET_FOOTER_SOCIAL_LINK'
    payload:{
        headerMenu?:HeaderMenuType[] | null
        logo?:PageLogoType | null
        pagePath?:string
        currentPage?:PageWithImageDataType | null
        childPage?:PageWithImageDataType[] | null
        subChilds?: {parentChildId:number, subChildList:Page[]}
        copyRight?:Page | null
        footerContact?:Page | null
        footerSocialLink?:Page[] | null
    }
}

// define initial state
const initialFrontEndState:FrontEndStateType = {
    headerMenu:null,
    logo:null,
    pagePath:'/',
    currentPage:null,
    childPage:null,
    copyRight:null,
    footerContact:null,
    footerSocialLinks:null
}

// define reducer function
const reducer = (prevState:FrontEndStateType, action:FrontEndAction):FrontEndStateType=>{
    switch(action.type){
        case 'SET_HEADER':{
            //set header menu of the web-site.
            return {...prevState, headerMenu:action.payload.headerMenu!}
        }
        case 'SET_LOGO':{
            // set the logo of the wev-site.
            return {...prevState, logo:action.payload.logo!}
        }
        case 'SET_PAGE_PATH':{
            // set the page location i.e. 'home', or 'about-us' etc.
            return {...prevState, pagePath:action.payload.pagePath!}
        }
        case 'SET_CURRENT_PAGE':{
            // set the data for the current page.
            return {...prevState, currentPage:action.payload.currentPage!, childPage:action.payload.childPage!}
        }
        case 'SET_CHILD_PAGE':{
            // set the data of childs of current page.
            return {...prevState, childPage:action.payload.childPage!}
        }
        case 'SET_SUB_CHILD':{
            // set the data of sub-childs of childs of current page.
            const newChildPage = prevState.childPage?.map(((childItem)=>{
                if(childItem.normalDetail?.id === action.payload.subChilds?.parentChildId){
                    return {...childItem, subChilds:action.payload.subChilds?.subChildList};
                }else{
                    return childItem;
                }
            }));
            console.log(newChildPage);
            
            return{...prevState, childPage:newChildPage!}
        }
        case 'SET_COPY_RIGHT':{
            return {...prevState, copyRight:action.payload.copyRight!}
        }
        case 'SET_FOOTER_CONTACT':{
            return {...prevState, footerContact:action.payload.footerContact!}
        }
        case 'SET_FOOTER_SOCIAL_LINK':{
            return {...prevState, footerSocialLinks:action.payload.footerSocialLink!}
        }
        default:{
            // return previous state.
            return prevState;
        }
    }
}

export const FrontEndContext = React.createContext({} as FrontEndContextType);

export const FrontEndProvider = ({children}:FrontEndProviderType)=>{
    // to check and set a flag to call for sub child check
    const [readyToGetSubChild, setReadyToGetSubChild] = useState(false);

    const [frontEndState, dispatch] = React.useReducer(reducer, initialFrontEndState);

    const location = useLocation();   
    const tempPath = location.pathname === '/'?'home-1': location.pathname.split('/page/')[1];
    if(tempPath !== frontEndState.pagePath){
        dispatch({type:'SET_PAGE_PATH',payload:{pagePath:tempPath}});
    }

    // reference to page db
    const pageRef = ref(db, 'pages');

    /**
     * It will accept any pageAttribute and related Value and returns the pagelist.
     * @param pageAttribute any attribute of type Page like 'id', 'pageType', 'title', 'pageAlias' etc
     * @param value any possible value of attribute like 'image' for 'pageType', 'logo' for 'pageAlias'
     * @author Anil
     */
     const getPageByAttributeAndValue = async (pageAttribute:string, value:string | number)=>{
        var tempPageList:Page[] = [];
        const pageDataQuery = query(pageRef, orderByChild(`${pageAttribute}`), equalTo(value)); 
        const snapshot = await get(pageDataQuery);
        if(snapshot.val())
            tempPageList = Object.values(snapshot.val());

        return tempPageList;
    };

    /**
     * to get header menu based on the page type "page-main-nav"
     * @author Anil
     */
    const getHeaderMenu = ()=>{
        // const page = ref(db, 'pages');
        const headerPageListQuery = query(pageRef, orderByChild('pageType'), equalTo('page-main-nav')); 
        var headerPageList:HeaderMenuType[] = [];

        onValue(headerPageListQuery, (data)=>{
            if(data?.val()){
                let pageList : Page[] = Object.values(data?.val());
                headerPageList = (pageList).map((page:Page)=>{

                    // create the page order by extracting the order number at the end of alias name
                    let order = parseInt(page.pageAlias.slice(-1));
                    return {
                        id:page.id, 
                        title:page.title, 
                        pageAlias:page.pageAlias, 
                        pageType:page.pageType, 
                        pageOrder:order,
                        pageLinkList:page.pageLinkList, 
                        pageImageList:page.pageImageList,
                        pageChildList:page.pageChildList
                    }
                });
                
                // sort the page by order and update to headerMenu state
                let sortedByPageOrder = headerPageList.sort((a,b)=>a.pageOrder - b.pageOrder);
                
                // dispatch 'SET_HEADER' to update the header Menu
                dispatch({type:'SET_HEADER',payload:{headerMenu:sortedByPageOrder}});
            }
        });
    }

    /**
     * It will get the logo
     */
    const getLogo = async ()=>{
        let logoPage = await getPageByAttributeAndValue('pageAlias', 'logo');
        dispatch({type:'SET_LOGO', payload:{logo:{
            id:logoPage[0].id,
            title:logoPage[0].title,
            pageAlias:logoPage[0].pageAlias,
            imageName:logoPage[0].imageName!,
            imageUrl:logoPage[0].imageUrl!
        }}});
    }

    /**
     * It will get the copy-right content
     */
    const getCopyRight =async () => {
        let copyRight = await getPageByAttributeAndValue('pageAlias', 'copy-rights');
        if(copyRight[0])
            dispatch({type:'SET_COPY_RIGHT', payload:{copyRight:copyRight[0]}});
    }


    /**
     * It will get the footer contact details
     */
     const getFooterContact =async () => {
        let footerContact = await getPageByAttributeAndValue('pageAlias', 'footer-contact');
        if(footerContact[0])
            dispatch({type:'SET_FOOTER_CONTACT', payload:{footerContact:footerContact[0]}});
    }

    /**
     * It will get the footer social links
     */
     const getFooterSocialLink =async () => {
        let footerSocialLinks = await getPageByAttributeAndValue('pageAlias', 'footer-social-links');
        let tempFooterSocialLinkList:Page[] = [];
        if(footerSocialLinks[0]?.pageImageList!.length >0){
            footerSocialLinks[0].pageImageList?.forEach(async (imageId)=>{
                let tempLink = await getPageByAttributeAndValue('id', imageId);
                tempFooterSocialLinkList.push(tempLink[0]);
                if(footerSocialLinks[0].pageImageList?.length === tempFooterSocialLinkList.length){
                    dispatch({type:'SET_FOOTER_SOCIAL_LINK', payload:{footerSocialLink:tempFooterSocialLinkList}});
                }
            })
        }
    }

    const getPageDetails = ()=>{
        getPageByAttributeAndValue('pageAlias', frontEndState.pagePath === '/'?'home-1':frontEndState.pagePath).then((data)=>{
            // list of image ids
            let pageImageList = data[0]?.pageImageList!;
            
            // list of child element
            let currentPageChildList = data[0]?.pageChildList;

            // to hold the image list of mainPage
            var tempPageImageList:Page[] = [];

            // to hold the sub-child list of child page
            // var tempSubChildList:subChildType[] = [];

            // get each image
            if(data[0] && pageImageList[0]!==0 && pageImageList.length > 0){
                pageImageList.forEach( async (id)=>{
                    await getPageByAttributeAndValue('id', id).then((imagePageData)=>{
                        if(imagePageData[0]){
                            tempPageImageList.push(imagePageData[0]);
                            if(pageImageList.length === tempPageImageList.length){
                                dispatch({type:'SET_CURRENT_PAGE', payload:{currentPage:{normalDetail:data[0], imageDetail:tempPageImageList}, childPage:null}});
                            }
                        }
                        
                    }).catch((error)=>console.log(error));
                });
            }else{
                dispatch({type:'SET_CURRENT_PAGE', payload:{currentPage:{normalDetail:data[0], imageDetail:[]}, childPage:null}});
            }
    
            // dispatch({type:'SET_CURRENT_PAGE', payload:{currentPage:{normalDetail:data[0], imageDetail:tempPageImageList}}});

            // get list of child page
            if(data[0] && currentPageChildList && currentPageChildList.length>0){
                var tempCurrentPageChilds:PageWithImageDataType[] = [];
                currentPageChildList?.forEach((child)=>{
                    getPageByAttributeAndValue('id',child?.childId!).then((childData)=>{
                        // check if child exists
                        if(childData[0]){
                            //loop through each child
                            var tempChildImageList:Page[] = [];
                            
                            // get images of the child from each pageImageList
                            if(childData[0].pageImageList && childData[0].pageImageList.length>0){
                                childData[0].pageImageList!.forEach(async (id)=>{
                                    await getPageByAttributeAndValue('id', id).then((childImageData)=>{
                                        tempChildImageList.push(childImageData[0]);

                                        // save child and its image pages when child's image iteration is done
                                        if(childData[0].pageImageList!.indexOf(id) === childData[0].pageImageList!.length - 1){
                                            // save each child and its image details into tempCurrentPageChilds
                                            tempCurrentPageChilds.push({
                                                normalDetail:childData[0],
                                                imageDetail:tempChildImageList,
                                                pageOrder:child.childOrder
                                            }); 

                                            // if all childs are iterated then set it to state
                                            if(tempCurrentPageChilds.length === currentPageChildList!.length){
                                                dispatch({type:'SET_CHILD_PAGE',payload:{childPage:tempCurrentPageChilds}});
                                                setReadyToGetSubChild(!readyToGetSubChild);                                                
                                            }
                                        }
                                    }).catch((error)=>console.log(error));
                                });
                            }else{
                                // save child and its image details into tempCurrentPageChilds
                                tempCurrentPageChilds.push({
                                    normalDetail:childData[0],
                                    imageDetail:tempChildImageList,
                                    pageOrder:child.childOrder
                                }); 

                                // if all childs are iterated then set it to state
                                if(tempCurrentPageChilds.length === currentPageChildList!.length){
                                    dispatch({type:'SET_CHILD_PAGE',payload:{childPage:tempCurrentPageChilds}});
                                    setReadyToGetSubChild(!readyToGetSubChild);
                                }
                            }
                        }else{
                            // reset to empty
                            // setChildPage([]);
                            dispatch({type:'SET_CHILD_PAGE',payload:{childPage:[]}});
                        }
                    }).catch((error)=>console.log(error))

                })

            }else{
                dispatch({type:'SET_CHILD_PAGE',payload:{childPage:[]}});
            }
        }).catch((error)=>console.log(error));
        
    }

    useEffect(()=>{
        getHeaderMenu();
        getLogo();
        getCopyRight();
        getFooterContact();
        getFooterSocialLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(()=>{
        getPageDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[frontEndState.pagePath]);

    // to get the sub childs of a child of a page.
    // useEffect(()=>{
    //     if(frontEndState.childPage){
    //         getPageByAttributeAndValue('pageAlias', frontEndState.pagePath === '/'?'home-1':frontEndState.pagePath).then((data)=>{
    //             // to hold the sub-child list of child page
    //             // var tempSubChildList:subChildType[] = [];
    
    //             // get list of child page
    //             if(data[0]){
    //                 getPageByAttributeAndValue('pageParent',data[0]?.id!).then((childs)=>{
    //                     // check if child exists
    //                     if(childs && childs.length>0){
    //                         //loop through each child
    //                         childs.forEach(async (child)=>{
    //                             // get the list of sub childs
    //                             getPageByAttributeAndValue('pageParent',child.id).then((subChilds)=>{
    //                                 if(subChilds && subChilds.length > 0){
    //                                     dispatch({type:'SET_SUB_CHILD', payload:{subChilds:{parentChildId:child.id, subChildList:subChilds}}})
    //                                 }
    //                             });
    //                         });
    //                     }
    //                 }).catch((error)=>console.log(error))
    //             }
    //         }).catch((error)=>console.log(error));
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[readyToGetSubChild]);


    useEffect(()=>{
        if(frontEndState.childPage && frontEndState.childPage.length >0){
            //loop through childPage list of frontEndState
            frontEndState.childPage.forEach((child)=>{
                if(child.normalDetail?.pageChildList && child.normalDetail?.pageChildList.length >0){
                    // to hold the sub-child list of child page
                    let tempSubChildData:Page[] = [];
                    
                    // iterate through child of child i.e. subchild
                    child.normalDetail.pageChildList.forEach((subChild)=>{
                        //get data of each sub child
                        getPageByAttributeAndValue('id',subChild?.childId!).then((subChildData)=>{
                            // check if child exists and then generate array of child with Data
                            if(subChildData[0]){
                                tempSubChildData.push(subChildData[0]);
                            }

                            if(child.normalDetail?.pageChildList?.length === tempSubChildData.length){
                                dispatch({type:'SET_SUB_CHILD', payload:{subChilds:{parentChildId:child.normalDetail.id, subChildList:tempSubChildData}}})
                            }
                        }).catch((error)=>console.log(error))
                    })
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[readyToGetSubChild]);


    return (<FrontEndContext.Provider value={{frontEndState, getHeaderMenu, getPageByAttributeAndValue, getPageDetails}}>
        {children}
    </FrontEndContext.Provider>)
}