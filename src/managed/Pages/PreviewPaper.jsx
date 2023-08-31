import React from "react";
import { get } from "../axios";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import "react-quill/dist/quill.snow.css";

export default function PreviewPaper() {
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState([]);
  const [htmlContent, setHtmlContent] = useState();

  useEffect(() => {
    const getPaper = async () => {
      const res = await get("healthedPaper");
      //   console.log(res);
      setPaper(res.data.data);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    setLoading(true);
    getPaper();
  }, []);

  useEffect(() => {
    if (paper.length > 0) {
      const htmlDoc = paper[0].paper_content;
      const parser = new DOMParser();
      // get the inner html of the body
      const decodedHtml2 = parser.parseFromString(htmlDoc, "text/html").body
        .innerHTML;
      setHtmlContent(decodedHtml2);
    }
    // setHtmlContent(htmlDoc);
  }, [paper]);

  // useEffect(() => {
  //   let container = document.getElementById("containerOfPreview");
  //   console.log(container);
  // }, [htmlContent]);
  // const htmlTest = "<p>hello World</p>";

  if (loading) return <LoadingComponent />;
  else
    return (
      <>
        <h1>{paper[0].paper_title}</h1>
        <div
          className="view ql-editor"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </>
    );
}
