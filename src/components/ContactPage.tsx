import React, { useRef } from 'react';
import { FrontEndContext } from '../context/FrontEndContext';
import { FlexDiv } from '../styles/globalStyleComponent';
import { Button } from './Button';
import { Input, TextArea } from './Input';
import { Map } from './Map';

import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";

export const ContactPage = ()=>{
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const {frontEndState} = React.useContext(FrontEndContext);

    const SITE_KEY = '----Use your own Recaptcha Key----';
    /**
     * Registers a user
     * @param e :React.SyntheticEvent to retrieve the form element using 
     * type assertion
     * @author Anil
     */

     const submitQuery =  (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        
        // get captcha value
        const captchaToken =  recaptchaRef?.current?.getValue();
        recaptchaRef?.current?.reset();

        if(captchaToken){
            emailjs.sendForm('---Use your own service key----', 'template_k56b8bq', e.currentTarget, '----Use your own siteKey for email js----')
                .then((result)=>{
                    alert('Query sent successfully');
                }, (error)=>{
                    console.log(error);
                });
        }else{
            alert('please select the captcha');
        }
    }


    return(
        <>
            {frontEndState.currentPage?.normalDetail?<FlexDiv flex="1 1 auto" flexDirection="column" alignContent="start" className="page__wrapper contact__page"> 
                {frontEndState.currentPage?.imageDetail![0]?.imageUrl? <FlexDiv flex="0 1 400px" width="100%" className="page__background-image after-content-space">
                    <img src={frontEndState.currentPage?.imageDetail![0]?.imageUrl} alt={frontEndState.currentPage?.imageDetail![0]?.title}/>
                </FlexDiv>:<FlexDiv flex="0 0 0" className="after-content-space"></FlexDiv>}

                <FlexDiv flex="0 1 40px" width="100%" className="container page-title">{frontEndState.currentPage?.normalDetail?.title}</FlexDiv>

                {frontEndState.childPage!?.length>0?<FlexDiv flex="1 1 auto" height="400px" width="100%" className="container after-content-space">
                    <Map mapData={frontEndState.childPage![0]?.normalDetail!?.description!?.toString().replace( /(<([^>]+)>)/ig, '')} />
                </FlexDiv>:''}


                <FlexDiv flex="1 1 auto" width="100%" gap="20px" className="container page__child-wrapper">
                    <FlexDiv flex="1 1 100%" flexDirection="column" className="page__description" width="100%">
                        {frontEndState.currentPage?.normalDetail?.description ? <FlexDiv flex="1 1 auto"><pre dangerouslySetInnerHTML={{ __html:`${frontEndState.currentPage?.normalDetail?.description!}`}}></pre></FlexDiv>:''}
                    </FlexDiv>
                    
                    <FlexDiv flex="1 1 100%" flexDirection="column" className="contact-form after-content-space" width="100%" gap="20px">
                        <FlexDiv flex="0 0 auto" flexDirection="column" gap="10px">
                            <h3>Fill the form to contact us for any enquiry</h3>
                            <sub>Please fill-up all the required ( <span style={{color:'red'}}>*</span> ) section.</sub>
                        </FlexDiv>
                        <form className="create-new-page__form" onSubmit={submitQuery}>
                            <FlexDiv flex="1 1 auto" width="100%" maxWidth="600px" gap="20px" flexWrap="wrap">
                                <Input flex="1 1 auto" width="280px" label="FIRST NAME" type="text" name="userFirstName" labelFor="userFirstName" 
                                    pattern="^[a-zA-Z \s]*$" 
                                    title="Only letters" 
                                    required={true}/>

                                <Input flex="1 1 auto" width="280px" label="LAST NAME" type="text" name="userLastName" labelFor="userLastName" 
                                    pattern="^[a-zA-Z \s]*$" 
                                    title="Only letter" 
                                    required={true}/>

                            </FlexDiv>

                            <FlexDiv flex="1 1 auto" width="100%" maxWidth="600px" gap="20px" flexWrap="wrap">
                                <Input flex="1 1 auto" width="280px" label="PHONE NUMBER" type="tel" name="userContactNo" labelFor="userContactNo"
                                    pattern="[0-9]{10}"
                                    title="any 10 digits number"
                                    required={true}/>

                                <Input flex="1 1 auto" width="280px" label="EMAIL" type="email" name="userEmail" labelFor="userEmail" 
                                    pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" 
                                    title="Should be a valid email"
                                    // errorMessage={authErrorMessage.emailError}
                                    required={true}/>

                            </FlexDiv>
                            
                            <FlexDiv flex="1 1 auto" width="100%" maxWidth="600px" gap="20px" flexWrap="wrap">
                                <TextArea flex="1 1 auto" width="280px" cols={1} rows={4} alignSelf="flex-start" label="QUERY" type="text" name="userQuery" labelFor="userQuery" 
                                    required={true}/>
                            </FlexDiv>
                            <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY}/>
                            <Button typeVariant="contained" typeColor="primary" maxWidth="599px"> SUBMIT</Button>

                        </form>
                    </FlexDiv>
                </FlexDiv>

            </FlexDiv>:<FlexDiv flex="1 1 auto" height="100%" justifyContent="center" alignItems="center"> <h2>Invalid link !!</h2></FlexDiv>}
        </>
    )
}
