"use client";

import { useState } from "react";

const Navbar = () => {
  const [members, setMembers] = useState<
    Array<{
      id: number;
      name: string;
      link: string;
      online?: boolean;
    }>
  >([
    {
      id: 1,
      name: "Sam Altman",
      link: "/sam",
    },
    {
      id: 2,
      name: "Rebecca Johnson",
      link: "/rebecca",
      online: true,
    },
    {
      id: 3,
      name: "George Latman",
      link: "/george",
      online: true,
    },
    {
      id: 4,
      name: "Liam Henson",
      link: "/liam",
    },
  ]);
  return (
    <div className="wrapper bg-neutral-300">
      <nav className="main-nav flex items-center justify-between py-[1.5rem] gap-[2.5rem]">
        <h2 className="text-[2rem] text-black">Trello Page</h2>
        <div className="search-container max-w-[30%] w-full relative">
          <input
            type="text"
            name=""
            id=""
            className="form-control w-full bg-white border border-neutral-700 rounded-md p-[0.5rem_2.5rem_0.5rem_1rem]"
            placeholder="Search"
          />
          <span className="icon-container w-[1.5rem] h-[1.5rem] absolute top-[50%] translate-y-[-50%] right-[0.6rem] fill-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </span>
        </div>
        <ul
          className={`member-list grid ml-auto`}
          style={{ gridTemplateColumns: `repeat(${members.length}, 3.2rem)` }}
        >
          {members.map((member) => (
            <li
              className={`member relative w-[4rem] h-[4rem] flex items-center justify-center rounded-full bg-red-800 border-2 border-white text-white text-[1.3rem] cursor-pointer uppercase transition-all delay-150 hover:translate-y-[-0.5rem] hover:z-30 ${
                member.online
                  ? "after:content-[''] after:w-[1rem] after:h-[1rem] after:border-2 after:border-white after:bottom-0 after:right-1 after:rounded-full after:bg-green-500 after:absolute"
                  : ""
              }`}
              key={member.id}
            >
              {member.name.split(" ").reduce((acc: any, curr: any) => {
                acc = acc + curr.split("")[0];
                return acc;
              }, "")}
            </li>
          ))}
        </ul>
        <ul className="menu-list flex items-center gap-[1rem]">
          <li className="item">
            <button
              type="button"
              className="w-[4rem] h-[4rem] rounded-full group hover:bg-neutral-400 flex items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-1/2 h-1/2 object-contain group-hover:fill-white"
              >
                <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
              </svg>
            </button>
          </li>
          <li className="item">
            <button
              type="button"
              className="w-[4rem] h-[4rem] rounded-full group hover:bg-neutral-400 flex items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-1/2 h-1/2 object-contain group-hover:fill-white"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
