import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";

const VideoCall = () => {
	const { userId } = useParams();
    console.log(userId)
	const [element, setElement] = useState(null);
	console.log(element)
	const containerRef = useRef(null);
	const Navigate = useNavigate();
    const userString = localStorage.getItem("user");



  const userObject = JSON.parse(userString);
  const userName = userObject.name;


	

	useEffect(() => {
		setElement(containerRef.current);
	}, []);
	useEffect(() => {
		const videoCall = async (element) => {
			const appId = 1957618223;
			const serverSecret = "4aabdbda460e526da3df31087924b3fc";
			const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
				appId,
				serverSecret,
				userId,
				Date.now().toString(),
				userName
			);
			const zc = ZegoUIKitPrebuilt.create(kitToken);
			zc.joinRoom({
				container: element,
				onLeaveRoom: () => {
					Navigate('/chat');
				},
				showPreJoinView: false,
				
				scenario: {
					mode: ZegoUIKitPrebuilt.OneONoneCall
				},
				showScreenSharingButton: false
			});
		};
		if (element) {
			videoCall(element);
		}
		
	}, [element,userId]);

	return (
		<div className="w-screen flex items-center justify-center h-screen bg-white dark:bg-black">
			<div className="text-cyan-700" ref={containerRef} />
		</div>
	);
};
export default VideoCall;