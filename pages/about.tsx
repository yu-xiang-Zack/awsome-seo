import { FC } from "react";
import { Button } from "antd";
import { GetStaticProps } from "next";
import csrFetch from "../utils/fetch";

const About: FC<{ data: { id: string; title: string }[] }> = ({ data }) => {
  const handleClick = () => {
    csrFetch("http://apitest.dianzhijia.com/api/open/article?page=3", {
      headers: {
        Accept: "application/vnd.dpexpo.v1+json",
      },
    }).then(({ data }) => {
      console.log(data, ">>");
    });
  };
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <li key={item.id}>{item.title}</li>
          <Button type="primary" onClick={handleClick}>AboutAboutAbout</Button>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let result = await fetch(
    "http://apitest.dianzhijia.com/api/open/article?page=1",
    {
      headers: {
        Accept: "application/vnd.dpexpo.v1+json",
      },
      method: "GET",
    }
  );
  let res = await result.json();
  const {
    data: { data },
  } = res;
  return {
    props: {
      data,
    },
  };
};

export default About;
