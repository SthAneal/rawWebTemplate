import React, { Fragment, useEffect } from 'react';
import { FlexDiv } from "../styles/globalStyleComponent"
// import { useLocation } from 'react-router-dom';
import { FrontEndContext } from '../context/FrontEndContext';

import { Page } from '../context/DashboardContext';

type PageWithImageDataType = {
    normalDetail:Page | null
    imageDetail:Page[] | null
}

// type CurrentPageType = {
//     mainPage:PageWithImageDataType | null
//     childPage:PageWithImageDataType[] | null
// } 


export const Landing = ()=>{
    // const [currentPath, setCurrentPath] = React.useState('');

    // // get location pathname
    // const location = useLocation();   
    // setCurrentPath(location.pathname);
    //console.log(location.pathname);

    const [currentPage, setCurrentPage] = React.useState({} as PageWithImageDataType);
    const [childPage, setChildPage] = React.useState({} as PageWithImageDataType[]);

    const { frontEndState, getPageByAttributeAndValue } = React.useContext(FrontEndContext);

    useEffect(()=>{
        // generate current page and child page data
        getPageByAttributeAndValue('pageAlias','home-1').then((data)=>{
            // complete current page type structure to hold the required data for the page
            // var tempMainPage:CurrentPageType = {
            //     mainPage: {
            //         normalDetail:null,
            //         imageDetail:null
            //     },
            //     childPage: [
            //         {
            //             normalDetail:null,
            //             imageDetail:null
            //         }
            //     ]
            // }

            // tempMainPage?['mainPage']['normalDetail'] = null;

            // list of image ids
            let pageImageList = data[0].pageImageList;
            
            // to hold the image list of mainPage
            var tempPageImageList:Page[] = [];

            // get each image
            if(data && pageImageList && pageImageList.length > 0){
                pageImageList.forEach((id)=>{
                    getPageByAttributeAndValue('id', id).then((imagePageData)=>{
                        console.log(imagePageData[0]);
                        tempPageImageList.push(imagePageData[0]);
                    }).catch((error)=>console.log(error));
                });

                // set current page and its image
                setCurrentPage({
                    normalDetail:data[0],
                    imageDetail:tempPageImageList
                });
                console.log(data[0]);
            }else{
                // set current page and null as its image
                setCurrentPage({
                    normalDetail:data[0],
                    imageDetail:null
                });
            }

            // get list of child page
            if(data){
                var tempCurrentPageChilds:PageWithImageDataType[] = [];
                getPageByAttributeAndValue('pageParent',data[0].id).then((childs)=>{
                    // check if child exists
                    if(childs && childs.length>0){
                        //loop through each child
                        childs.forEach((child)=>{
                            var tempChildImageList:Page[] = [];
                            // get images of the child from each pageImageList
                            if(child.pageImageList && child.pageImageList.length>0){
                                child.pageImageList.forEach((id)=>{
                                    getPageByAttributeAndValue('id', id).then((childImageData)=>{
                                        // console.log(childImageData[0]);
                                        tempChildImageList.push(childImageData[0]);
                                    }).catch((error)=>console.log(error));
                                    // console.log(tempChildImageList);
                                });
                                // save child and its image details into tempCurrentPageChilds
                                tempCurrentPageChilds.push({
                                    normalDetail:child,
                                    imageDetail:tempChildImageList
                                }); 

                                setChildPage(tempCurrentPageChilds);
                            }
                        });
                    }
                }).catch((error)=>console.log(error))
            }
        }).catch((error)=>console.log(error));
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[frontEndState])


    return (
        <FlexDiv flexDirection="column">
            <FlexDiv flex="0 0 auto">
                {currentPage.normalDetail?.title}
            </FlexDiv>
            <FlexDiv>
                {currentPage.imageDetail && currentPage.imageDetail.length>0?<img style={{'width':'300px', 'height':'auto'}} src={currentPage.imageDetail[0].imageUrl!} alt={currentPage.imageDetail[0].title}/>:''}
            </FlexDiv>
            <div dangerouslySetInnerHTML={{ __html:`${currentPage.normalDetail?.description!}`}}></div>
            
        </FlexDiv>
    )
}