<?php
/*储存临时信息会话的脚本*/
//启动会话
session_start();

//声明并初始化用户信息数组
$currUsr = array(
    "UsrID" => $usr[0]["UsrID"],
    "UsrName" => $usr[0]["UsrName"],
    "UsrGen" => $usr[0]["UsrGen"],
    "UsrRole" => $usr[0]["UsrRole"],
    "UsrEmail" => $usr[0]["UsrEmail"],
    "UsrAdms" => $usr[0]["UsrAdms"],
    "ColgAbrv" => $usr[0]["ColgAbrv"],
    "MjrAbrv" => $usr[0]["MjrAbrv"],
    "AvatarPath" => $usr[0]["AvatarPath"]
);

//创建会话变量
$_SESSION["currUsr"] = $currUsr;
?>