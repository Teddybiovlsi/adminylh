import React, { useState } from 'react';
import { Card, Col, Container, Image, Row, Stack } from 'react-bootstrap';
import BtnBootstrap from '../../../components/BtnBootstrap';
import {
  SwitchNumToLanguage,
  SwitchNumToType,
} from './func/SwitchNumToLanguage';

export default function InputFormBasicPreviewFunction({
  isSkip = false,
  isCheckValidationQA = false,
  VideoName = '',
  VideoTitle = '',
  VideoLanguage = '',
  VideoType = '',
  VideoQA,
  GoPrevEvent = null,
  SubmitEvent = null,
  SubmitEventDisabled = false,
}) {
  return (
    <Container>
      <Row>
        <Col className='h5 ps-0' md={4}>
          影片名稱:
        </Col>
        <Col md={6}>{VideoTitle != '' ? VideoTitle : VideoName}</Col>
      </Row>

      <Row>
        <Col className='h5 ps-0' md={4}>
          影片語言:
        </Col>
        <Col md={6}>{SwitchNumToLanguage(parseInt(VideoLanguage))}</Col>
      </Row>

      <Row>
        <Col className='h5 ps-0' md={4}>
          影片類型:
        </Col>
        <Col md={6}>{SwitchNumToType(parseInt(VideoType))}</Col>
      </Row>
      <Row>
        <Col className='h5 ps-0' md={4}>
          是否跳過填寫影片問題:
        </Col>
        <Col md={6}>
          <b>{isSkip ? '是' : '否'}</b>{' '}
        </Col>
      </Row>
      {!isSkip &&
        isCheckValidationQA &&
        VideoQA?.map((q, i) => (
          <Card key={i} className='mb-2'>
            <Card.Title className='mb-2 ms-1'>問題 {i + 1}:</Card.Title>
            <Container>
              <Row>
                <Col className='h5 ps-0 ms-2' md={4}>
                  問題內容:
                </Col>
                <Col md={6}>{q.questionContent}</Col>
              </Row>
            </Container>
            {/* {q.answerFile[i] !== null &&
              q.answerFile.map((file, j) => (

              ))} */}

            {q.answerContent.map((a, j) => (
              <div key={`${i}-${j}`}>
                <Card.Title className='ms-2'>{`答案${String.fromCharCode(
                  65 + j
                )}:`}</Card.Title>
                <Card.Text
                  className={`ms-4 ${a[0] ? 'text-success' : 'text-danger'}`}
                >{`${a[1]}-答案為${a[0] ? '正確' : '錯誤'}`}</Card.Text>
                {q.answerFile[j] && (
                  <Card.Img
                    variant='top'
                    src={URL.createObjectURL(q.answerFile[j])}
                    alt={`optionImage${j}`}
                    style={{ width: '100px' }}
                  />
                )}
              </div>
            ))}
          </Card>
        ))}

      <Stack gap={2} className='col-md-5 mx-auto'>
        <BtnBootstrap
          btnPosition=''
          btnName='formStep'
          btnSize='md'
          disabled={SubmitEventDisabled}
          text={'送出表單'}
          onClickEventName={SubmitEvent}
          variant='outline-primary'
        />
        <BtnBootstrap
          btnPosition=''
          btnName={'formStep'}
          btnSize='md'
          text={'上一步'}
          onClickEventName={GoPrevEvent}
          variant={'outline-danger'}
        />
      </Stack>
    </Container>
  );
}
