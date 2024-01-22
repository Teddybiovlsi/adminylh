import { Navbar, Container, Col, InputGroup, Form } from "react-bootstrap";
import ToolTipBtn from "./ToolTipBtn";

const VideoNavbar = ({
  isAdmin = false,
  handleShowAddVideoModal,
  handleEditVideoSource,
  handleEditVideo,
  handleShowDeleteVideoModal,
  disabledEditBtn,
  disabledDelBtn,
  searchTextVideo,
  setSearchTextVideo,
}) => {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Col xs>
          <ToolTipBtn
            placement="bottom"
            btnAriaLabel="新增影片"
            btnOnclickEventName={handleShowAddVideoModal}
            btnText={
              <i
                className="bi bi-file-earmark-plus"
                style={{ fontSize: 1.2 + "rem" }}
              ></i>
            }
            btnVariant="light"
            tooltipText="新增影片"
          />
          <ToolTipBtn
            placement="bottom"
            btnAriaLabel="修改原始影片"
            btnDisabled={disabledEditBtn ? true : false}
            btnOnclickEventName={handleEditVideoSource}
            btnText={
              <i className="bi bi-film" style={{ fontSize: 1.2 + "rem" }}></i>
            }
            btnVariant="light"
            tooltipText="修改原始影片"
          />

          <ToolTipBtn
            placement="bottom"
            btnAriaLabel="修改影片問題"
            btnDisabled={disabledEditBtn ? true : false}
            btnOnclickEventName={handleEditVideo}
            btnText={
              <i
                className="bi bi-pencil-square"
                style={{ fontSize: 1.2 + "rem" }}
              ></i>
            }
            btnVariant="light"
            tooltipText="修改影片問題"
          />

          {isAdmin && (
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="刪除影片"
              btnDisabled={disabledDelBtn ? true : false}
              btnOnclickEventName={handleShowDeleteVideoModal}
              btnText={
                <i
                  className="bi bi-trash3-fill"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="刪除影片"
            />
          )}
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              defaultValue={searchTextVideo}
              placeholder="影片名稱搜尋.."
              style={{ boxShadow: "none" }}
              onChange={(e) => {
                setSearchTextVideo(e.target.value);
              }}
            />
          </InputGroup>
        </Col>
      </Container>
    </Navbar>
  );
};

export default VideoNavbar;
