// import { useInputValidation } from "6pp";
// import { Search as SearchIcon } from "@mui/icons-material";
// import {
//   Dialog,
//   DialogTitle,
//   InputAdornment,
//   List,
//   Stack,
//   TextField,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useLazySearchUserQuery,
//   useSendFriendRequestMutation,
// } from "../../redux/api/api";
// import { setIsSearch } from "../../redux/reducers/mics";
// import UserItem from "../shared/UserItem";

// import { useAsyncMutation } from "../../hooks/Hooks";

// const Search = () => {
//   const { isSearch } = useSelector((state) => state.mics);

//   const [searchUser] = useLazySearchUserQuery();
//   // const [sendFriendRequest] = useSendFriendRequestMutation();
//   const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
//     useSendFriendRequestMutation
//   );
//   const dispatch = useDispatch();

//   const search = useInputValidation("");

//   const addFriendHandler = async (id) => {
//     console.log(id);
//     await sendFriendRequest("send friend request", { userId: id });
//   };

//   // const isLoadingSendFriendRequest = false;
//   const [users, setUsers] = useState([]);

//   const searchCloseHandler = () => {
//     dispatch(setIsSearch(false));
//   };

//   // ? we costumise because give error users not defined for st
//   useEffect(() => {
//     const timeOutId = setTimeout(() => {
//       // console.log("search.value", search.value);
//       searchUser(search.value)
//         .then(({ data }) => setUsers(data.users))
//         .catch((error) => console.log(error));
//     }, 700);
//     return () => clearTimeout(timeOutId);
//   }, [search.value]);

//   return (
//     <Dialog open={isSearch} onClose={searchCloseHandler}>
//       <Stack p={"2rem"} direction={"column"} width={"25rem"}>
//         <DialogTitle textAlign={"center"}>Find People</DialogTitle>
//         <TextField
//           label=""
//           autoFocus
//           value={search.value}
//           onChange={search.changeHandler}
//           variant="outlined"
//           size="small"
//           InputProps={{
//             // Use InputProps instead of inputProps
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <List>
//           {users.map((user) => (
//             <UserItem
//               user={user}
//               key={user._id}
//               handler={addFriendHandler}
//               handlerIsLoading={isLoadingSendFriendRequest}
//             />
//           ))}
//         </List>
//       </Stack>
//     </Dialog>
//   );
// };

// export default Search;

import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/mics";
import UserItem from "../shared/UserItem";
import { useAsyncMutation } from "../../hooks/Hooks";

const Search = () => {
  const { isSearch } = useSelector((state) => state.mics);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);
  const inputRef = useRef(null); // Create a ref for the input element

  const addFriendHandler = async (id) => {
    console.log(id);
    await sendFriendRequest("send friend request", { userId: id });
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((error) => console.log(error));
    }, 700);
    return () => clearTimeout(timeOutId);
  }, [search.value, searchUser]);

  useEffect(() => {
    // Focus the input element when the component mounts
    if (isSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearch, inputRef]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          inputRef={inputRef}
          autoFocus
        />

        <List>
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
