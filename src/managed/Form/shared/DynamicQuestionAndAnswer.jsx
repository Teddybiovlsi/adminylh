import React from 'react';
import {
  Card,
  CloseButton,
  Form,
  InputGroup,
  FloatingLabel,
} from 'react-bootstrap';
import BtnBootstrap from '../../../components/BtnBootstrap';
import styles from '../../../styles/Form/FormStyles.module.scss';

function DynamicQuestionandAnswer({
  FormMode = false,
  VideoQA,
  handleDelQAMessage,
  handleGetVideoTime,
  handleGetVideoDuration,
  handleGetQuestionMustCorrect,
  handleGetQuestionContent,
  handleOptionChange,
  handleIsCorrectOption,
  handleAnswerChange,
}) {
  return (
    <>
      {VideoQA.map((info, index) => (
        <Card key={index} style={{ position: 'relative' }} className='mb-2'>
          {index > 0 && (
            <CloseButton
              className={`${styles.deleteQAMessage}`}
              onClick={() => {
                handleDelQAMessage(index);
              }}
            />
          )}
          <Card.Title className='pt-3 ps-3 pe-3 pb-0'>
            <h3>問題 {index + 1}</h3>
            {FormMode && (
              <p className={`${styles.noticficationMessage}`}>
                <strong>若下列填寫問題為必答問題請點選○</strong>
              </p>
            )}
            <p className={`${styles.noticficationMessage}`}>
              <strong>若此為該問題答案請點選○</strong>
            </p>
          </Card.Title>
          <Card.Body>
            {/* Get Current Video Question Time */}
            <InputGroup className='mb-2'>
              {/* Btn Get Current Time */}
              <BtnBootstrap
                btnID={'button-addon1'}
                onClickEventName={(e) => handleGetVideoTime(index, e)}
                text={'取得當前時間'}
                variant='secondary'
              />

              {/* After get current Time of the Video frame show in the cintrol box */}
              <Form.Control
                name='currentTime'
                placeholder='請點選左方按鍵取得影片當前時間'
                aria-label='Example text with button addon'
                aria-describedby='basic-addon1'
                value={info.currentTime}
                disabled
              />
              <InputGroup.Text>秒</InputGroup.Text>
            </InputGroup>
            {/* Get the duration of the video show question time */}
            <InputGroup className='mb-3'>
              <Form.Control
                // only can input number
                type='number'
                placeholder='請輸入問題持續時間'
                aria-label='請輸入問題持續時間'
                aria-describedby='basic-addon2'
                value={info.duration}
                onChange={(e) => {
                  handleGetVideoDuration(index, e);
                }}
                size='lg'
              />
              <InputGroup.Text id='basic-addon2'>秒</InputGroup.Text>
            </InputGroup>

            {/* In this inputGroup is about Question and Answer Select */}
            <InputGroup className='pb-2'>
              {FormMode && (
                <InputGroup.Checkbox
                  aria-label='若此為必對問題請點選'
                  onChange={() => {
                    handleGetQuestionMustCorrect(index);
                  }}
                  checked={info.mustCorrectQuestion}
                />
              )}
              <Form.Floating>
                <Form.Control
                  name='questionContent'
                  id='floatingInput'
                  type='text'
                  placeholder={`請在這裡輸入問題${String.fromCharCode(
                    65 + index
                  )}`}
                  value={info.questionContent}
                  onChange={(e) => {
                    handleGetQuestionContent(index, e);
                  }}
                />
                <label htmlFor='floatingInput'>{`請輸入問題${
                  index + 1
                }`}</label>
              </Form.Floating>
              <FloatingLabel
                controlId='floatingSelectGrid'
                label='請選擇問答題目數'
              >
                <Form.Select
                  aria-label='Floating label select example'
                  value={info.numofOptions}
                  onChange={(e) => {
                    handleOptionChange(index, e);
                  }}
                >
                  <option value=''>請點擊開啟選單</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                </Form.Select>
              </FloatingLabel>
            </InputGroup>
            {/* 以下是動態答案控制欄位 */}
            {info.answerContent.map((answerContent, answerContentIndex) => (
              <InputGroup
                key={`${index}-${answerContentIndex}`}
                className='mb-2'
              >
                <InputGroup.Checkbox
                  aria-label='若此為該問題答案請點選○'
                  checked={answerContent[0]}
                  onChange={(e) => {
                    handleIsCorrectOption(index, answerContentIndex);
                  }}
                />
                <Form.Floating>
                  <Form.Control
                    id='floatingInput'
                    type='text'
                    placeholder={`請在這裡輸入答案${String.fromCharCode(
                      65 + answerContentIndex
                    )}`}
                    value={answerContent[1]}
                    onChange={(e) => {
                      handleAnswerChange(index, answerContentIndex, e);
                    }}
                  />
                  <label htmlFor='floatingInput'>{`請輸入答案${String.fromCharCode(
                    65 + answerContentIndex
                  )}`}</label>
                </Form.Floating>
              </InputGroup>
            ))}
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default DynamicQuestionandAnswer;
