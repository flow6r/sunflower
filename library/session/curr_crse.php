<?php
/*储存临时信息会话的脚本*/
//启动会话
session_start();

//声明并初始化用户信息数组
$currCrse = array(
    "CrseID" => $crse[0]["CrseID"],
    "CrseName" => $crse[0]["CrseName"],
    "CrseDesc" => $crse[0]["CrseDesc"],
    "CoverPath" => $crse[0]["CoverPath"],
    "UsrID" => $crse[0]["UsrID"],
    "UsrName" => $crse[0]["UsrName"],
);

//创建会话变量
$_SESSION["currCrse"] = $currCrse;
?>