package com.pinyougou.sellergoods.service;

import java.util.List;
import java.util.Map;

import entity.PageResult;
import com.pinyougou.pojo.TbBrand;


/**
 * 品牌接口
 *
 * @author biao
 */
public interface BrandService {
    //查询所有
    List<TbBrand> findAll();
    //分页查询
    PageResult findPage(int pageNum, int pageSize);
	//添加品牌
    void add(TbBrand brand);
    //根据id查询品牌
    TbBrand findById(long id);
    //修改品牌的信息
    void update(TbBrand brand);
    //删除品牌
    void delete(Long[] ids);
    //条件查询
    PageResult findPage(TbBrand brand,int pageNum, int pageSize);
    //模板里的品牌下拉框数据
    List<Map> selectOptionList();

}
