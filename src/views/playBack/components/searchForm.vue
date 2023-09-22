<template>
  <div class="search-card">
    <el-form :inline="true" :model="formInline" label-width="100px" class="demo-form-inline">
    <el-form-item label="开始时间 :">
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker
            v-model="formInline.date1"
            type="date"
            label="请选择时间"
            placeholder="请选择时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="date3">
          <el-time-picker
            v-model="formInline.date2"
            label="请选择时间"
            placeholder="请选择时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>

    </el-form-item>
    <el-form-item label="结束时间 :">
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker
            v-model="formInline.date3"
            type="date"
            label="请选择时间"
            placeholder="请选择时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="date3">
          <el-time-picker
            v-model="formInline.date4"
            label="请选择时间"
            placeholder="请选择时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="回放对象 :">
      <el-select v-model="formInline.region" placeholder="请选择">
        <el-option label="张三" value="zs" />
        <el-option label="李四" value="ls" />
      </el-select>
    </el-form-item>
  </el-form>
    <div class="search-btn" @click.stop="handleSearch">查询</div>
  </div>
</template>

<script setup lang="ts">
import { ElForm,ElFormItem,ElSelect,ElOption,ElInput,ElButton,ElDatePicker,ElCol,ElTimePicker } from "element-plus";

const formInline = reactive({
  date1:'',
  date2:'',
  date3:'',
  date4:'',
  user: '',
  region: '',
})

const handleSearch = () => {
  console.log(111);
  
};
</script>

<style lang="scss" scoped>
.search-card {
  position: absolute;
  right: 0vw;
  top: 7vh;
  z-index: 999;
  padding: 1vw;
  width: 28vw;
  min-width: 328px;
  height: 22vh;
  background: rgba(9, 46, 85, 0.5);
  border: 1px solid #3289ab;
  :deep(.el-form-item__label){
    color: #fff
  }

}
.search-btn {
  @include flexCenter;
  position: absolute;
  top: 19vh;
  left: 13vw;
  font-size: 14px;
  z-index: 1;
  color: #00fee7;
  cursor: pointer;
  width: 92px;
  height: 37px;
  background-image: url("@/assets/posIcon/homequery.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
