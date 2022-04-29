<?php
/*储存临时信息会话的脚本*/
//启动会话
session_start();

//声明并初始化用户信息数组
$currMs = array(
    "MsID" => $ms[0]["MsID"],
    "MsName" => $ms[0]["MsName"],
    "MsDesc" => $ms[0]["MsDesc"],
    "CrseID" => $ms[0]["CrseID"],
    "UsrID" => $ms[0]["UsrID"],
    "PkgPath" => $ms[0]["PkgPath"],
);

//创建会话变量
$_SESSION["currMs"] = $currMs;
?>