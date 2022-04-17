<?php
/*获取用户信息会话中数据的脚本*/
//启动会话
session_start();

//检查会话变量是否存在
if (!isset($_SESSION["userInfo"])) {
    //返回错误信息
    $error = ["error"=>"启动会话时发生错误，请联系管理员并反馈问题"];
    $errorJSON = json_encode($error, JSON_UNESCAPED_UNICODE);
    echo $errorJSON;
} else {
    //将会话变量转换成JSON数据返回给浏览器端
    $usrInfoJSON = json_encode($_SESSION["userInfo"], JSON_UNESCAPED_UNICODE);
    echo $usrInfoJSON;
    //将用户信息写入JSON文件
    file_put_contents("user_info.json", $usrInfoJSON);
}

exit;
?>