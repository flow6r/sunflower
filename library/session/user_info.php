<?php
/*储存用户信息会话的脚本*/
//启动会话
session_start();

//检查专业信息字段
if(empty($MjrAbrv)) $MjrName = null;

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
    "ColgName" => $ColgName,
    "MjrName" => $MjrName,
);

//创建会话变量
$_SESSION["userInfo"] = $userInfo;
?>