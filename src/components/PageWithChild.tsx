import React, { useEffect } from 'react';
import { FrontEndContext } from '../context/FrontEndContext';
import { FlexDiv } from '../styles/globalStyleComponent';
import { PageWithImageDataType } from '../context/FrontEndContext';
import { MdOutlineLink } from 'react-icons/md';


export const PageWithChild = ()=>{
    
    const {frontEndState} = React.useContext(FrontEndContext);
    const [currentPage, setCurrentPage] = React.useState(null as unknown as PageWithImageDataType)
    const [childPage, setChildPage] = React.useState(null as unknown as PageWithImageDataType[])

    useEffect(()=>{
        if(frontEndState.currentPage)
            setCurrentPage(frontEndState.currentPage);

        if(frontEndState.childPage){
            let orderedChildPage = frontEndState.childPage.sort((a,b)=>a.pageOrder! - b.pageOrder!);
            setChildPage(orderedChildPage);
        }

    },[frontEndState]);

    return(
        <FlexDiv flex="1 1 auto" flexDirection="column" alignContent="start" className="page__wrapper"> 

            {/* To render the main page image and description */}

            {currentPage?.imageDetail![0]?.imageUrl? <FlexDiv flex="0 1 400px" width="100%" className="page__background-image after-content-space">
                <img src={currentPage?.imageDetail![0]?.imageUrl} alt={currentPage?.imageDetail![0]?.title}/>
            </FlexDiv>:<FlexDiv flex="0 0 0" className="after-content-space"></FlexDiv>}

            <FlexDiv flex="0 1 40px" width="100%" className="container page-title">{currentPage?.normalDetail?.title}</FlexDiv>

            <FlexDiv flex="0 1 auto" className="container page__description after-content-space">
                {currentPage?.normalDetail?.description ? <div><pre dangerouslySetInnerHTML={{ __html:`${currentPage?.normalDetail?.description!}`}}></pre></div>:''}
            </FlexDiv>


            {/* To render the child pages */}

            {childPage && childPage!.length > 0 ?<FlexDiv flex="0 1 auto" width="100%" className="page__child" flexDirection="column">
                {
                    childPage!.map((child)=>(
                        <FlexDiv key={child.normalDetail?.id} flex="0 1 auto" width="100%" className={(childPage.indexOf(child) % 2 === 0)?'bg-striped-dark':'bg-striped-light'}>
                            <FlexDiv flexDirection="column" className="container">

                                {/* title of the page */}
                                <FlexDiv flex="0 1 40px" width="100%" className="page-title">{child.normalDetail?.title}</FlexDiv>
                                <FlexDiv flex="1 1 auto" width="100%" gap="100px" justifyContent="space-between" className="page__child-wrapper">
                                    {/* child image section */}
                                        {child.imageDetail![0]?.imageUrl? <FlexDiv flex="0 1 600px" flexDirection="column" gap="5px" order={(childPage.indexOf(child) % 2 === 0)?'1':'2'} className="child__image-wrapper">
                                            {/* <img style={{'width':'300px','height':'300px'}} src={child.imageDetail![0]?.imageUrl ? child.imageDetail![0]?.imageUrl : ''} alt={child.imageDetail![0]?.title} /> */}
                                            <FlexDiv flex="1 1 400px" width="100%" minHeight="300px" className="child__image-holder"
                                                style={{'backgroundImage':`url(${child.imageDetail![0]?.imageUrl})`, 'backgroundSize':'contain', 'backgroundRepeat':'no-repeat','backgroundPosition':'center'}}
                                            ></FlexDiv>
                                            <div className="child__image-wrapper--description"><pre dangerouslySetInnerHTML={{ __html:`${child.imageDetail![0]?.description!}`}}></pre></div>
                                        </FlexDiv>:''}

                                    {/* child description section */}
                                    <FlexDiv flex="0 1 500px" order={(childPage.indexOf(child) % 2 === 0)?'2':'1'} flexDirection="column" gap="50px">
                                        <div><pre dangerouslySetInnerHTML={{ __html:`${child.normalDetail?.description!}`}}></pre></div>
                                        {child.subChilds && child.subChilds!.length>0?<FlexDiv flex="1 1 auto" width="100%" flexDirection="column">
                                            <FlexDiv flex="1 1 auto" className="page-title page-title__sub">Related Links</FlexDiv>
                                            <ul className="ul__default-link">
                                                {
                                                    child.subChilds?.map((subChild)=>{
                                                        if(subChild.pageAlias === 'location'){
                                                            return(<li key={subChild.id} className="li--inline"><MdOutlineLink className="li--inline__icon"/><a href={child.normalDetail?.pageAlias}>{subChild.title}</a></li>)
                                                        }else{
                                                            return(<li key={subChild.id} className="li--inline"><MdOutlineLink className="li--inline__icon"/><a href={subChild.pageAlias}>{subChild.title}</a></li>)
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </FlexDiv>:''}

                                    </FlexDiv>
                                </FlexDiv>

                            </FlexDiv>
                        </FlexDiv>
                    ))
                }
            </FlexDiv>:''}

        </FlexDiv>
    )
}