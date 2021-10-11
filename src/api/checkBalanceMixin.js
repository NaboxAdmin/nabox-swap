
export default {
  methods: {
    checkBalance(cost) {
      const currentAddress = this.$store.getters.getSelectAddress
      if (currentAddress.balance - cost < 0) {
        this.$confirm(this.$t('transfer.transfer32'), this.$t('nodeService.nodeService21'), {
          confirmButtonText: this.$t('password.password2'),
          cancelButtonText: this.$t('nav.convert'),
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          center: true
        }).then(() => {

        }).catch(() => {
          this.$router.push('/swap')
        });
        return false
      }
      return true
    }
  }
}