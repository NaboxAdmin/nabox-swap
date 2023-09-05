<template>
  <div class="pay-asset-const">
    <input type="number">
    <coinItem/>
  </div>
</template>

<script>
import coinItem from '@/views/Buy/component/coinItem';
export default {
  name: 'AssetInput',
  components: {
    coinItem
  }
};
</script>

<style scoped lang="scss">
.pay-asset-const {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  border: 1px solid #E6E9F0;
  height: 96px;
  input {
    color: #3A3C44;
    flex: 1;
    width: 50px;
    border: none;
    background-color: transparent;
    outline: none;
    font-size: 36px;
    font-weight: 500;
    padding: 0px 32px;
    border-right: 1px solid #E6E9F0;
    height: 100%;
    &::placeholder {
      color: #ABB1BA;
      font-size: 30px;
    }
  }
}
</style>
