import avatar2 from "@/assets/images/avatars/avatar-2.png"
import avatar4 from "@/assets/images/avatars/avatar-4.png"
import avatar5 from "@/assets/images/avatars/avatar-5.png"
import avatar6 from "@/assets/images/avatars/avatar-6.png"
import avatar7 from "@/assets/images/avatars/avatar-7.png"
import avatar8 from "@/assets/images/avatars/avatar-8.png"

// 定义男性和女性的头像数组
const maleAvatars = [avatar2, avatar5, avatar7];
const femaleAvatars = [avatar4, avatar6, avatar8];

export function toAvatar(user) {
    // 检查用户性别并返回相应的随机头像
    if (user.sex === '男') {
        // 从男性头像数组中随机选择一张图片
        const randomIndex = Math.floor(Math.random() * maleAvatars.length);
        return maleAvatars[randomIndex];
    } else if (user.sex === '女') {
        // 从女性头像数组中随机选择一张图片
        const randomIndex = Math.floor(Math.random() * femaleAvatars.length);
        return femaleAvatars[randomIndex];
    } else {
        // 如果性别未知或无效，可以返回一个默认头像或抛出错误
        console.warn('未知性别:', user.sex);
        return avatar2; // 或者返回一个默认头像路径
    }
}

export function isSuccess(res){
    if (res.code === 1){
        if(res.msg){
            alert(res.msg)
        }
        console.log(res)
    }else {
        alert(res.msg)
    }
}
//分页
export const options = ref({page: 1, itemsPerPage: 10, sortBy: [''], sortDesc: [false]})
