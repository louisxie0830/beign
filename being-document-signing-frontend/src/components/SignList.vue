<template>
  <draggable v-if="list.length > 0"
             v-model="list"
             handle=".handle"
             class="list-wrap">
    <template v-for="(item, index) in list">
      <v-list-tile class="list-item" :key="item.name + item.email" avatar>
        <v-list-item-avatar class="handle">
          <div class="titleNo ma-3">{{ index + 1 }}</div>
        </v-list-item-avatar>
        <v-list-tile-content @click.stop="listType === '' && selectPerson(index)">
          <v-list-tile-sub-title class="title-info">
            <v-icon size="16">email</v-icon>
            {{ item.email }}
          </v-list-tile-sub-title>
          <v-list-tile-sub-title class="title-info">
            <v-icon size="16">person</v-icon>
            <span v-text="item.name" />
            <span class="select-person" v-if="listType === ''">
              {{ item.companyName ? item.companyName : $t('common.person') }}
              {{ item.typeName ? item.typeName : $t('sign_document_info.toast.sign.text') }}
            </span>
            <v-icon size="16" v-if="listType === ''">keyboard_arrow_down</v-icon>
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action @click.stop="removeMember(item)">
          <v-btn icon
                 ripple
                 round>
            <v-icon color="grey lighten-1">clear</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </template>   
  </draggable>
</template>


<script>
import draggable from 'vuedraggable';
import isEqual from 'lodash/isEqual';

export default {
  components: {
    draggable
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    listType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDragging: false,
      delayedDragging: false
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        ghostClass: 'ghost'
      };
    }
  },
  watch: {
    isDragging(newValue) {
      console.log('newValue: ', newValue);
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
    list(newValue, oldValue) {
      console.log('newValue: ', newValue);
      if (!isEqual(newValue, oldValue)) {
        this.$emit('updateMember', newValue);
      }
    }
  },
  methods: {
    removeMember({ email, name }) {
      this.$emit('removeMember', { email, name });
    },
    selectPerson(index) {
      this.modal.show({
        componentName: 'selectPersonModal',
        extra: {
          email: this.list[index].email
        },
        onConfirm: data => {
          const company = data.company[0];
          const agree = data.agree[0];
          // this.$set(this.list[index], 'company', company);
          // this.$set(this.list[index], 'agree', agree);
          this.$set(this.list[index], 'type', agree.remark);
          this.$set(this.list[index], 'typeName', agree.name);
          this.$set(this.list[index], 'corpId', company.id);
          this.$set(this.list[index], 'companyName', company.name);
          this.$emit('updateMember', this.list);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
}
.action-icon {
  position: absolute;
  right: -25px;
  z-index: 9;
}
.list-wrap {
  position: relative;
}
.no-move {
  transition: transform 0s;
}
.select-person {
  cursor: pointer;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.handle {
  cursor: pointer;
}
</style>
