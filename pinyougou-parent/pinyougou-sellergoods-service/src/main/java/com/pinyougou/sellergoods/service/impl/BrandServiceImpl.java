package com.pinyougou.sellergoods.service.impl;

import java.util.List;
import java.util.Map;

import entity.PageResult;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.pojo.TbBrandExample;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BrandServiceImpl implements BrandService {

    @Autowired
    private TbBrandMapper brandMapper;

    //查询所有的品牌
    @Override
    public List<TbBrand> findAll() {
        List<TbBrand> list = brandMapper.selectByExample(null);
        return list;
    }

    //品牌分页
    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);//分页
        Page<TbBrand> list = (Page<TbBrand>) brandMapper.selectByExample(null);
        return new PageResult(list.getTotal(), list.getResult());
    }

    //添加品牌
    @Override
    public void add(TbBrand brand) {
        brandMapper.insert(brand);

    }

    //根据品牌id查询品牌信息
    @Override
    public TbBrand findById(long id) {
        return brandMapper.selectByPrimaryKey(id);
    }

    //修改品牌信息
    @Override
    public void update(TbBrand brand) {
        brandMapper.updateByPrimaryKey(brand);
    }

    //删除品牌
    @Override
    public void delete(Long[] ids) {
        for (Long id : ids) {
            brandMapper.deleteByPrimaryKey(id);
        }
    }

    //条件查询
    @Override
    public PageResult findPage(TbBrand brand,int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);//分页
        TbBrandExample example = new TbBrandExample();
        TbBrandExample.Criteria criteria = example.createCriteria();
        if (brand!=null){
            if (brand.getName()!=null&&brand.getName().length()>0){
                criteria.andNameLike("%"+brand.getName()+"%");
            }
            if (brand.getFirstChar()!=null&&brand.getFirstChar().length()>0){
                criteria.andFirstCharLike(brand.getFirstChar());
            }
        }
        Page<TbBrand> list = (Page<TbBrand>) brandMapper.selectByExample(example);

        return new PageResult(list.getTotal(), list.getResult());
    }

    //模板里的品牌下拉框数据
    @Override
    public List<Map> selectOptionList() {
        return brandMapper.selectOptionList();
    }


}
