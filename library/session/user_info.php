<?php
/*储存用户信息会话的脚本*/
//启动会话
session_start();

//声明并初始化用户信息数组
$userInfo = array(
    "UsrID" => $UsrID,
    "UsrName" => $UsrName,
    "UsrGen" => $UsrGen,
    "UsrRole" => $UsrRole,
    "UsrEmail" => $UsrEmail,
    "UsrAdms" => $UsrAdms,
    "ColgAbrv" => $ColgAbrv,
    "MjrAbrv" => $MjrAbrv,
);

//创建会话变量
$_SESSION["userInfo"] = $userInfo;
?>